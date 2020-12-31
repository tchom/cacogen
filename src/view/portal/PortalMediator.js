
import { GameCommands } from '../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class PortalMediator extends Mediator {
    static get NAME() { return "PortalMediator" };

    constructor(viewComponent) {
        super(PortalMediator.NAME);
        this.subscribeNotification([
            GameCommands.CHANGE_SCENE_COMPLETE,
        ]);
        this.viewComponent = viewComponent;

        this.viewComponent.on('picker:portal', this.selectedPortal, this);

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.SET_CAMERA_TARGET:
                break;
        }
    }

    selectedPortal() {
        const portalComponent = this.viewComponent.script['PortalComponent'];
        const destinationScene = portalComponent.destinationScene;
        const destinationPortal = portalComponent.destinationPortal;
        const standingPosition = portalComponent.standingPoint.getPosition();

        this.facade.sendNotification(GameCommands.NAVIGATE_THROUGH_PORTAL,
            standingPosition, destinationScene, destinationPortal);
    }
}
