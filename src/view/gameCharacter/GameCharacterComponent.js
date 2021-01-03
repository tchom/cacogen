import { Facade } from "@koreez/pure-mvc";
import { GameFacade } from '../../GameFacade';
import { GameCharacterProxy } from "../../model/gameCharacter/GameCharacterProxy";
import { GameCharacterMediator } from './GameCharacterMediator';
import { botBehaviourEnums } from '../../behaviourTree/BotBehaviourTypes';
import { weaponEnums } from "../../data/WeaponTypes";
import { GameMapProxy } from '../../model/gameMap/GameMapProxy';

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
        name: 'initiative',
        title: 'Initiative',
        type: 'number',
        default: 2
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


GameCharacterComponent.attributes.add("characterHeight", {
    type: "number",
    title: "Character Height",
    default: 1.8
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

GameCharacterComponent.attributes.add("dialogueTreeName", {
    type: "string",
    title: "Dialogue Tree Name"
});

GameCharacterComponent.attributes.add("botBehaviour", {
    type: "number",
    title: "Bot Behaviour",
    enum: botBehaviourEnums,
    default: 0
});


GameCharacterComponent.attributes.add("equippedWeapon", {
    type: "string",
    title: "Equipped Weapon",
    enum: weaponEnums,
    default: "unarmed"
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


    if (!this.preregisteredNotifications) {
        this.preregisteredNotifications = [];
    }

    const statsOverrides = this.statsOverrides;
    const proxyParams = {
        id: this.characterId,
        isNPC: this.isNPC,
        height: this.characterHeight,
        advancedSkills: this.advancedSkills,
        equippedWeapon: this.equippedWeapon,
        ...statsOverrides,
        botBehaviour: this.botBehaviour,
        dialogueTree: this.dialogueTreeName
    };

    if (this.combatGroupName && this.combatGroupName !== "") {
        const comradeEntities = this.app.root.findByTag(`combatGroup:${this.combatGroupName}`);

        const combatGroup = [];
        for (const comradeEntity of comradeEntities) {
            // Ignore disabled entities
            if (comradeEntity.enabled) {
                const comradeId = comradeEntity.script['GameCharacterComponent'].characterId;
                combatGroup.push(comradeId);
            }
        }
        proxyParams.combatGroup = combatGroup;
    }

    if (this.facade.hasMediator(GameCharacterMediator.NAME + this.characterId)) {
        this.facade.removeMediator(GameCharacterMediator.NAME + this.characterId);
    }

    if (this.facade.hasProxy(GameCharacterProxy.NAME + this.characterId)) {
        // this.facade.removeProxy(GameCharacterProxy.NAME + this.characterId);
    } else {
        const characterProxy = new GameCharacterProxy(proxyParams);
        // Set current node if game character was created after the map
        const gameMapProxy = this.facade.retrieveProxy(GameMapProxy.NAME);
        if (gameMapProxy) {
            const currentNode = gameMapProxy.findNearestNode(this.entity.getPosition());
            characterProxy.currentNode = currentNode;
        }

        this.facade.registerProxy(characterProxy);
    }


    this.facade.registerMediator(new GameCharacterMediator(this.characterId, this.entity, this.preregisteredNotifications));

    this.vehicle = this.entity.script['VehicleComponent'];
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
        const nodePoint = new pc.Vec3(nextPathPoint.x, nextPathPoint.y, nextPathPoint.z);


        const distanceToNextPath = localPos.distance(nodePoint);
        if (distanceToNextPath <= (dt * this.characterSpeed)) {
            const currentNode = this.movementPath.pop();

            if (this.movementPath.length === 0) {
                this.entity.fire('finishedMove', currentNode);
                this.entity.animation.loop = true;
                this.entity.animation.play('idle.glb', 0.1);
            }
            this.entity.fire('updateCurrentNode', currentNode);
        } else {
            if (this.movementPath.length > 1) {
                this.vehicle.seek(nodePoint, dt);
            } else {
                this.vehicle.arrive(nodePoint, dt);
            }
            this.vehicle.processVelocity(dt);
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