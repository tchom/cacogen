
import { GameCommands } from '../../controller/GameCommands';
import { GameCamera } from './GameCamera';
const { Mediator } = require('@koreez/pure-mvc');

export class GameCameraMediator extends Mediator {
    static get NAME() { return "GameCameraMediator" };

    constructor(viewComponent) {
        super(GameCameraMediator.NAME);
        this.subscribeNotification([
            GameCommands.CHANGE_SCENE_COMPLETE, GameCommands.INPUT_DRAG_MOUSE, GameCommands.SET_CAMERA_TARGET
        ]);
        this.viewComponent = viewComponent;

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.SET_CAMERA_TARGET:
                this.viewComponent.script['GameCamera'].setCameraTarget(args[0]);
                break;
            case GameCommands.INPUT_DRAG_MOUSE:
                this.viewComponent.script['GameCamera'].handleDrag(args[0]);
                break;
        }
    }
}
