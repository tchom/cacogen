export const HitboxComponent = pc.createScript('HitboxComponent');


HitboxComponent.prototype.postInitialize = function () {
    const scale = this.entity.getLocalScale();
    const halfExtents = new pc.Vec3(scale.x / 2, scale.y / 2, scale.z / 2);
    this.aabb = new pc.BoundingBox(this.entity.getPosition(), halfExtents);
    this.app.on('picker:raycast', this.handleRayCast, this);

    this.entity.on('stopListening', () => {
        this.app.off('picker:raycast', this.handleRayCast, this);
    });

    this.entity.on('destroy', () => {
        this.app.off('picker:raycast', this.handleRayCast, this);
    });

    this.entity.model.enabled = false;

}

HitboxComponent.prototype.handleRayCast = function (ray, screenPos) {
    const hitPosition = new pc.Vec3();
    const result = this.aabb.intersectsRay(ray, hitPosition);
    if (result) {
        this.app.fire('picker:result', this.entity.parent, hitPosition, screenPos);
    }
}

HitboxComponent.prototype.update = function (dt) {
    this.aabb.center.copy(this.entity.getPosition());
}
