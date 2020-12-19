export const GameCamera = pc.createScript('GameCamera');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../GameFacade';
import { GameCameraMediator } from './GameCameraMediator';

GameCamera.attributes.add('distance', { type: 'number', default: 100, title: 'Distance' });
GameCamera.attributes.add('dragMultiplierX', { type: 'number', default: 0.5, title: 'Drag Multiplier' });
GameCamera.attributes.add('dragMultiplierY', { type: 'number', default: 0.5, title: 'Drag Multiplier' });

GameCamera.attributes.add('minCameraHeight', { type: 'number', default: 5, title: 'Min Camera Height' });
GameCamera.attributes.add('maxCameraHeight', { type: 'number', default: 100, title: 'Max Camera Height' });

// initialize code called once per entity
GameCamera.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(GameCameraMediator.NAME)) {
        this.facade.removeMediator(GameCameraMediator.NAME);
    }

    this.facade.registerMediator(new GameCameraMediator(this.entity));

};

GameCamera.prototype.setCameraTarget = function (cameraTarget) {
    this.cameraTarget = cameraTarget;
    this.rotation = this.entity.getEulerAngles().y;
    this.cameraHeight = this.entity.getLocalPosition().y;
}

GameCamera.prototype.handleDrag = function (direction) {
    this.rotation += direction.x * this.dragMultiplierX;

    let newCameraHeight = this.cameraHeight - (direction.y * this.dragMultiplierY);
    newCameraHeight = pc.math.clamp(newCameraHeight, this.minCameraHeight, this.maxCameraHeight);
    this.cameraHeight = newCameraHeight;
}

GameCamera.prototype.getTargetCameraPosition = function (focusPoint) {
    const cameraPosition = this.entity.getLocalPosition()

    const targetX = Math.sin((this.rotation) * Math.PI / 180) * this.distance;
    const targetZ = Math.cos((this.rotation) * Math.PI / 180) * this.distance;

    return new pc.Vec3(focusPoint.x + targetX, cameraPosition.y, focusPoint.z + targetZ);
}

// update code called every frame
GameCamera.prototype.update = function (dt) {
    if (this.cameraTarget) {
        const cameraTargetPosition = this.cameraTarget.getLocalPosition();
        const targetPosition = this.getTargetCameraPosition(cameraTargetPosition);

        const currentPos = this.entity.getLocalPosition();
        const tweenX = (targetPosition.x + currentPos.x * 9) / 10;
        const tweenY = (this.cameraHeight + currentPos.y * 9) / 10;
        const tweenZ = (targetPosition.z + currentPos.z * 9) / 10;

        this.entity.setLocalPosition(tweenX, tweenY, tweenZ);

        this.entity.lookAt(cameraTargetPosition);
    }

};
