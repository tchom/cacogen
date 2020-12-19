export const PlayerCharacterComponent = pc.createScript('PlayerCharacterComponent');

PlayerCharacterComponent.attributes.add("characterSpeed", {
    type: "number",
    title: "Character Speed",
    default: 4
});

// initialize code called once per entity
PlayerCharacterComponent.prototype.initialize = function () {
    this.movementPath = [];
};


PlayerCharacterComponent.prototype.setPath = function (path) {
    this.movementPath = path;
    this.movementPath.pop();


};

PlayerCharacterComponent.prototype.update = function (dt) {
    this.moveAlongPath(dt);
}


PlayerCharacterComponent.prototype.moveAlongPath = function (dt) {
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
        if (distanceToNextPath < 0.1) {
            const currentNode = this.movementPath.pop();
            this.entity.fire('updateCurrentNode', currentNode);
        }
    }
}
