import { Facade } from "@koreez/pure-mvc";
import { GameFacade } from '../../GameFacade';
import { InputLayerMediator } from './InputLayerMediator';
import { GameCameraMediator } from '../gameCamera/GameCameraMediator';

export const InputLayerComponent = pc.createScript('InputLayerComponent');

InputLayerComponent.attributes.add("cameraEntity", {
    type: "entity",
    title: "Camera Entity"
});

InputLayerComponent.attributes.add("dragTime", {
    type: "number",
    title: "Drag Time",
    default: 0.4
});


InputLayerComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(InputLayerMediator.NAME)) {
        this.facade.removeMediator(InputLayerMediator.NAME);
    }

    this.facade.registerMediator(new InputLayerMediator(this.entity));
    this.ray = new pc.Ray();

    /*this.entity.element.on('click', (evt) => {
        this.handleRaycastCollisions(evt.x, evt.y);
    });*/

    // Drag properties
    this.app.mouse.disableContextMenu();
    this.clickDownStart = 0;
    this.isDragging = false;

    this.app.on('picker:result', this.handlePickerResult, this);

    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    this.entity.element.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);

    this.entity.once('destroy', () => {
        this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);

    });
}

InputLayerComponent.prototype.onMouseDown = function (evt) {
    this.isDragging = true;
    this.clickDownStart = Date.now();
    this.clickStartPoint = { x: evt.x, y: evt.y };
}


InputLayerComponent.prototype.onMouseMove = function (evt) {
    if (this.isDragging) {
        const direction = new pc.Vec2(this.clickStartPoint.x - evt.x, this.clickStartPoint.y - evt.y);
        this.entity.fire('scrolling', direction);
        this.clickStartPoint = { x: evt.x, y: evt.y };
    }
}

InputLayerComponent.prototype.onMouseUp = function () {
    this.isDragging = false;

    if (Date.now() - this.clickDownStart < (this.dragTime * 1000)) {
        if (this.clickStartPoint) {
            // this.entity.fire('validClick', this.clickStartPoint);
            this.handleRaycastCollisions(this.clickStartPoint.x, this.clickStartPoint.y);
        }
    }
}

InputLayerComponent.prototype.handleRaycastCollisions = function (x, y) {
    const cameraEntity = this.cameraEntity;
    const cameraComponent = this.cameraEntity.camera;
    cameraComponent.screenToWorld(x, y, cameraComponent.farClip, this.ray.direction);
    this.ray.origin.copy(cameraEntity.getPosition());
    this.ray.direction.sub(this.ray.origin).normalize();

    this.app.fire('picker:raycast', this.ray, { x, y });
}

InputLayerComponent.prototype.handlePickerResult = function (pickedEntity, hitPosition, screenPos) {
    if (pickedEntity.tags.has('navigation')) {
        const navComp = pickedEntity.script['NavigationComponent'];
        const nearestNode = navComp.getNearestNode(hitPosition);
        this.entity.fire('picker:navigation', nearestNode);
    }
}
