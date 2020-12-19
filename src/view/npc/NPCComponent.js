import { Facade } from "@koreez/pure-mvc";
import { NPCMediator } from './NPCMediator';
import { GameFacade } from '../../GameFacade';

export const NPCComponent = pc.createScript('NPCComponent');

NPCComponent.attributes.add("characterId", {
    type: "string",
    title: "Character Id"
});

NPCComponent.attributes.add("characterSpeed", {
    type: "number",
    title: "Character Speed",
    default: 4
});

// initialize code called once per entity
NPCComponent.prototype.initialize = function () {
    this.movementPath = [];
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(NPCMediator.NAME + this.characterId)) {
        this.facade.removeMediator(NPCMediator.NAME + this.characterId);
    }

    this.facade.registerMediator(new NPCMediator(this.characterId, this.entity));
};


NPCComponent.prototype.setPath = function (path) {
    this.movementPath = path;
    this.movementPath.pop();
};

NPCComponent.prototype.update = function (dt) {
    this.moveAlongPath(dt);
}


NPCComponent.prototype.moveAlongPath = function (dt) {
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

        const dx = nextPathPoint.x - localPos.x;
        const dz = nextPathPoint.z - localPos.z;
        const angleToDest = Math.atan2(dx, dz) * 180 / Math.PI;
        this.entity.setEulerAngles(0, angleToDest, 0);

        this.entity.setLocalPosition(newPosition);

        const distanceToNextPath = newPosition.distance(nodePoint);
        if (distanceToNextPath < 0.15) {
            const currentNode = this.movementPath.pop();
            this.entity.fire('updateCurrentNode', currentNode);
        }
    }
}
