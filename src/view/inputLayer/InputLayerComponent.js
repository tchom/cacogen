import { Facade } from "@koreez/pure-mvc";
import { GameFacade } from '../../GameFacade';
import { InputLayerMediator } from './InputLayerMediator';
import { GameCameraMediator } from '../gameCamera/GameCameraMediator';

export const InputLayerComponent = pc.createScript('InputLayerComponent');

InputLayerComponent.attributes.add("cameraEntity", {
    type: "entity",
    title: "Camera Entity"
});

InputLayerComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(InputLayerMediator.NAME)) {
        this.facade.removeMediator(InputLayerMediator.NAME);
    }

    this.facade.registerMediator(new InputLayerMediator(this.entity));
    this.ray = new pc.Ray();

    this.entity.element.on('click', (evt) => {
        this.handleRaycastCollisions(evt.x, evt.y);
    });
    GameCameraMediator

    this.app.on('picker:result', this.handlePickerResult, this);
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
