

export const ProjectileComponent = pc.createScript('ProjectileComponent');

ProjectileComponent.attributes.add("projectileSpeed", {
    type: "number",
    title: "Projectile Speed",
    default: 8
});


ProjectileComponent.prototype.initialize = function () {

}

ProjectileComponent.prototype.setTarget = function (originPoint, targetPoint) {
    this.entity.setLocalPosition(originPoint.x, originPoint.y, originPoint.z);
    this.targetPoint = targetPoint;
    this.lookAtPoint(this.targetPoint);

}

ProjectileComponent.prototype.update = function (dt) {
    if (this.targetPoint) {
        const localPos = this.entity.getLocalPosition();
        const newPosition = new pc.Vec3();
        const speed = new pc.Vec3(dt * this.projectileSpeed, dt * this.projectileSpeed, dt * this.projectileSpeed);
        newPosition.sub2(this.targetPoint.clone(), localPos);
        newPosition.normalize();
        newPosition.mul(speed);
        newPosition.add(localPos);

        this.entity.setLocalPosition(newPosition);

        const distanceToNextPath = newPosition.distance(this.targetPoint);
        if (distanceToNextPath <= (dt * this.projectileSpeed)) {
            this.entity.fire('projectileArrived');
            this.entity.destroy();
        }
    }
}


ProjectileComponent.prototype.lookAtPoint = function (point) {
    const localPos = this.entity.getLocalPosition();

    const dx = point.x - localPos.x;
    const dz = point.z - localPos.z;
    const angleToDest = Math.atan2(dx, dz) * 180 / Math.PI;
    this.entity.setEulerAngles(0, angleToDest, 0);
}