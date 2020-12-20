import { Facade } from "@koreez/pure-mvc";
import { GameFacade } from '../../GameFacade';
import { GameCharacterProxy } from "../../model/gameCharacter/GameCharacterProxy";
import { GameCharacterMediator } from './GameCharacterMediator';

export const GameCharacterComponent = pc.createScript('GameCharacterComponent');

GameCharacterComponent.attributes.add("characterId", {
    type: "string",
    title: "Character Id"
});

GameCharacterComponent.attributes.add("characterSpeed", {
    type: "number",
    title: "Character Speed",
    default: 4
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

    this.facade.registerProxy(new GameCharacterProxy(this.characterId));
    this.facade.registerMediator(new GameCharacterMediator(this.characterId, this.entity, this.preregisteredNotifications));
};


GameCharacterComponent.prototype.setPath = function (path) {
    this.movementPath = path;
    this.movementPath.pop();
};

GameCharacterComponent.prototype.stopMovement = function (currentNode) {
    this.movementPath = [];
    this.entity.setLocalPosition(currentNode.x, currentNode.y, currentNode.z);
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