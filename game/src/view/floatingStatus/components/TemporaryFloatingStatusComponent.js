export const TemporaryFloatingStatusComponent = pc.createScript('TemporaryFloatingStatusComponent');

// TemporaryFloatingStatusComponent.attributes.add('maxCameraHeight', { type: 'number', default: 100, title: 'Max Camera Height' });

// initialize code called once per entity
TemporaryFloatingStatusComponent.prototype.initialize = function () { };

TemporaryFloatingStatusComponent.prototype.setWorldPosition = function (worldPosition, camera, screen) {
    this.entity.enabled = true;
    this.worldPosition = worldPosition;
    this.device = this.app.graphicsDevice;
    this.cameraEntity = camera;
    this.screenEntity = screen;

    setTimeout(() => {
        this.entity.destroy();
    }, 1000);
}

// update code called every frame
TemporaryFloatingStatusComponent.prototype.postUpdate = function (dt) {
    const position = this.worldSpaceToScreenSpace(this.worldPosition.clone());
    if (position) {
        this.entity.setLocalPosition(position);
    }
};

TemporaryFloatingStatusComponent.prototype.worldSpaceToScreenSpace = function (pos) {
    if (this.device && this.cameraEntity && this.screenEntity) {
        const worldPos = pos.clone();
        const screenPos = new pc.Vec3();
        // get screen space co-ord
        this.cameraEntity.camera.worldToScreen(worldPos, screenPos);
        const pixelRatio = this.app.graphicsDevice.maxPixelRatio;
        screenPos.x *= pixelRatio;
        screenPos.y *= pixelRatio;

        const screenComp = this.screenEntity.screen;

        const ratioScale = screenComp.scale;
        const x = (screenPos.x / ratioScale);
        const y = (this.device.height - screenPos.y) / ratioScale;

        return new pc.Vec3(x, y, 0);
    }

    return undefined;

}