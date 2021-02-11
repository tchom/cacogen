
import { GameCommands } from '../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class FloatingStatusCreatorMediator extends Mediator {
    static get NAME() { return "FloatingStatusCreatorMediator" };

    constructor(viewComponent) {
        super(FloatingStatusCreatorMediator.NAME);
        this.subscribeNotification([
            GameCommands.DISPLAY_FLOATING_STATUS
        ]);
        this.viewComponent = viewComponent;

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.DISPLAY_FLOATING_STATUS:
                const scriptComp = this.viewComponent.script['FloatingStatusCreatorComponent'];
                const floaterName = args[0];
                const targetProxy = args[1];

                scriptComp.displayStatus(floaterName, targetProxy);
                break;
        }
    }
}
