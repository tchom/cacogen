export const SetCameraTargetComponent = pc.createScript('SetCameraTargetComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameCommands } from '../../../controller/GameCommands';
import { GameFacade } from '../../../GameFacade';

// postInitialize code called once per entity
SetCameraTargetComponent.prototype.postInitialize = function () {
    const facade = Facade.getInstance(GameFacade.KEY);
    facade.sendNotification(GameCommands.SET_CAMERA_TARGET, this.entity);
};
