export const ScreenResizeComponent = pc.createScript('ScreenResizeComponent');

ScreenResizeComponent.prototype.window = window;

ScreenResizeComponent.prototype.postInitialize = function () {
    this.onResize();

    this.window.addEventListener('resize', this.onResize.bind(this), false);
}


ScreenResizeComponent.prototype.onResize = function () {
    const graphicsDevice = this.app.graphicsDevice;
    console.log(this.entity.screen);
    // Flip blend
    if (graphicsDevice.width < graphicsDevice.height) {
        this.entity.screen.scaleBlend = 1;
    } else {
        this.entity.screen.scaleBlend = 0;
    }

    this.entity.screen.referenceResolution = new pc.Vec2(graphicsDevice.width, graphicsDevice.height);

    /*this.entity.screen.width = graphicsDevice.width;
    this.entity.screen.height = graphicsDevice.height;*/
}