import { Facade } from "@koreez/pure-mvc";
import { GameFacade } from '../../GameFacade';
import { GameCharacterProxy } from "../../model/gameCharacter/GameCharacterProxy";
import { GameCharacterMediator } from './GameCharacterMediator';

export const GameCharacterComponent = pc.createScript('GameCharacterComponent');

const statsSchema = [
    {
        name: 'skill',
        title: 'Skill',
        type: 'number',
        default: 1
    },
    {
        name: 'maxStamina',
        title: 'Stamina',
        type: 'number',
        default: 1
    }, {
        name: 'maxLuck',
        title: 'Luck',
        type: 'number',
        default: 1
    }, {
        name: 'maxMovement',
        title: 'Movement',
        type: 'number',
        default: 6
    }
];

const advancedSkillsSchema = [
    {
        name: 'skillName',
        title: 'Skill Name',
        type: 'string'
    },
    {
        name: 'skillValue',
        title: 'Skill Value',
        type: 'string'
    }
];

GameCharacterComponent.attributes.add("characterId", {
    type: "string",
    title: "Character Id"
});

GameCharacterComponent.attributes.add("characterSpeed", {
    type: "number",
    title: "Character Speed",
    default: 4
});

GameCharacterComponent.attributes.add("isNPC", {
    type: "boolean",
    title: "is NPC",
    default: true
});

GameCharacterComponent.attributes.add("statsOverrides", {
    type: "json",
    title: "Stats Overrides",
    schema: statsSchema
});

GameCharacterComponent.attributes.add("advancedSkills", {
    type: "json",
    title: "Advanced Skills",
    schema: advancedSkillsSchema,
    array: true
});

GameCharacterComponent.attributes.add("combatGroupName", {
    type: "string",
    title: "Combat Group Name"
});


GameCharacterComponent.prototype.preregisterNotification = function (notification) {
    if (!this.preregisteredNotifications) {
        this.preregisteredNotifications = [];
    }

    this.preregisteredNotifications.push(notification);
}

// initialize code called once per entity
GameCharacterComponent.prototype.postInitialize = function () {
    this.movementPath = [];
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(GameCharacterMediator.NAME + this.characterId)) {
        this.facade.removeMediator(GameCharacterMediator.NAME + this.characterId);
    }

    if (!this.preregisteredNotifications) {
        this.preregisteredNotifications = [];
    }

    const statsOverrides = this.statsOverrides;
    const proxyParams = {
        id: this.characterId,
        isNPC: this.isNPC,
        advancedSkills: this.advancedSkills,
        ...statsOverrides
    };

    if (this.combatGroupName && this.combatGroupName !== "") {
        const comradeEntities = this.app.root.findByTag(`combatGroup:${this.combatGroupName}`);

        const combatGroup = [];
        for (const comradeEntity of comradeEntities) {
            const comradeId = comradeEntity.script['GameCharacterComponent'].characterId;
            combatGroup.push(comradeId);

        }
        proxyParams.combatGroup = combatGroup;
    }

    this.facade.registerProxy(new GameCharacterProxy(proxyParams));
    this.facade.registerMediator(new GameCharacterMediator(this.characterId, this.entity, this.preregisteredNotifications));

    this.entity.animation.play('idle.glb', 0.1);

};


GameCharacterComponent.prototype.setPath = function (path) {
    if (this.movementPath && this.movementPath.length > 0) {
        this.entity.fire('cancelMove');
    }
    this.movementPath = path;

    this.entity.animation.loop = true;
    this.entity.animation.play('walk.glb', 0.1);
};

GameCharacterComponent.prototype.stopMovement = function (currentNode) {
    this.movementPath = [];
    this.entity.setLocalPosition(currentNode.x, currentNode.y, currentNode.z);

    this.entity.animation.loop = true;
    this.entity.animation.play('idle.glb', 0.1);
};

GameCharacterComponent.prototype.update = function (dt) {
    this.moveAlongPath(dt);
}


GameCharacterComponent.prototype.moveAlongPath = function (dt) {

    if (this.movementPath.length > 0) {
        const nextPathPoint = this.movementPath[this.movementPath.length - 1];
        const localPos = this.entity.getLocalPosition();
        const newPosition = new pc.Vec3();
        const speed = new pc.Vec3(dt * this.characterSpeed, dt * this.characterSpeed, dt * this.characterSpeed);
        const nodePoint = new pc.Vec3(nextPathPoint.x, nextPathPoint.y, nextPathPoint.z);
        newPosition.sub2(nodePoint, localPos);
        newPosition.normalize();
        newPosition.mul(speed);
        newPosition.add(localPos);

        this.entity.setLocalPosition(newPosition);
        this.lookAtPoint(nextPathPoint);

        const distanceToNextPath = newPosition.distance(nodePoint);
        if (distanceToNextPath < 0.15) {
            const currentNode = this.movementPath.pop();

            if (this.movementPath.length === 0) {
                this.entity.fire('finishedMove', currentNode);
                this.entity.animation.loop = true;
                this.entity.animation.play('idle.glb', 0.1);
            }
            this.entity.fire('updateCurrentNode', currentNode);
        }
    }
}

GameCharacterComponent.prototype.lookAtPoint = function (point) {
    const localPos = this.entity.getLocalPosition();

    const dx = point.x - localPos.x;
    const dz = point.z - localPos.z;
    const angleToDest = Math.atan2(dx, dz) * 180 / Math.PI;
    this.entity.setEulerAngles(0, angleToDest, 0);
}

GameCharacterComponent.prototype.animateDeath = function () {
    this.entity.animation.loop = false;
    this.entity.animation.play('die.glb', 0.1);
}

GameCharacterComponent.prototype.animateHit = function () {
    this.entity.animation.loop = false;
    this.entity.animation.play('hit.glb', 0.1);
}

GameCharacterComponent.prototype.animateAttack = function () {
    this.entity.animation.loop = false;
    this.entity.animation.play('attack.glb', 0.1);
}