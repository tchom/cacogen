export const GameCamera = pc.createScript('GameCamera');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../GameFacade';
import { GameCameraMediator } from './GameCameraMediator';


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
}

GameCamera.prototype.getTargetCameraPosition = function (focusPoint) {
    const cameraPosition = this.entity.getLocalPosition()
    const cameraAngles = this.entity.getEulerAngles()
    const dLength = cameraPosition.y / Math.tan(cameraAngles.x * -1 * Math.PI / 180);

    const targetX = Math.sin((cameraAngles.y) * Math.PI / 180) * dLength;
    const targetZ = Math.cos((cameraAngles.y) * Math.PI / 180) * dLength;

    return new pc.Vec3(focusPoint.x + targetX, cameraPosition.y, focusPoint.z + targetZ);
}

// update code called every frame
GameCamera.prototype.update = function (dt) {
    if (this.cameraTarget) {
        const targetPosition = this.getTargetCameraPosition(this.cameraTarget.getLocalPosition());

        const currentPos = this.entity.getLocalPosition();
        const tweenX = (targetPosition.x + currentPos.x * 3) / 4;
        const tweenZ = (targetPosition.z + currentPos.z * 3) / 4;

        this.entity.setLocalPosition(tweenX, currentPos.y, tweenZ);
    }
};
