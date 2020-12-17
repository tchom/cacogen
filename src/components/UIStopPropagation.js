export const UIStopPropagation = pc.createScript('UIStopPropagation');

UIStopPropagation.prototype.initialize = function () {
    this.entity.element.on(pc.EVENT_MOUSEDOWN, (evt) => {
        evt.stopPropagation();
    });

    this.entity.element.on(pc.EVENT_MOUSEDOWN, (evt) => {
        evt.stopPropagation();
    });

    this.entity.element.on(pc.EVENT_TOUCHSTART, (evt) => {
        evt.stopPropagation();
    });

    this.entity.element.on(pc.EVENT_TOUCHMOVE, (evt) => {
        evt.stopPropagation();
    });

    this.entity.element.on(pc.EVENT_TOUCHEND, (evt) => {
        evt.stopPropagation();
    });
}

