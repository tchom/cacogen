
import { GameCommands } from '../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class ActionPanelMediator extends Mediator {
    static get NAME() { return "ActionPanelMediator" };

    constructor(viewComponent) {
        super(ActionPanelMediator.NAME);
        this.subscribeNotification([
            GameCommands.SET_PLAYER_ACTION, GameCommands.TOGGLE_BUTTON,
            GameCommands.USE_PLAYER_ACTION
        ]);
        this.viewComponent = viewComponent;

        this.viewComponent.on('click:fireCommand', this.handleFireCommand, this);

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.TOGGLE_BUTTON:
                const actionName = args[0];
                console.log(`Show button ${actionName}`);
                this.viewComponent.script['ActionPanelComponent'].selectAction(actionName);
                break;
            case GameCommands.USE_PLAYER_ACTION:

                break;
        }
    }

    handleFireCommand(commandName, ...args) {
        console.log(commandName, args);
        this.facade.sendNotification(commandName, ...args);
    }
}
