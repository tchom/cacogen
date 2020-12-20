
import { GameCommands } from '../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class ToastMessageMediator extends Mediator {
    static get NAME() { return "ToastMessageMediator" };

    constructor(viewComponent) {
        super(ToastMessageMediator.NAME);
        this.subscribeNotification([
            GameCommands.SHOW_TOAST_MESSAGE
        ]);

        this.viewComponent = viewComponent;
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.SHOW_TOAST_MESSAGE:
                this.viewComponent.script['ToastMessageComponent'].addMessage(args[0]);

                break;
        }
    }
}
