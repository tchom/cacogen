
import { GameCommands } from '../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class ActionPanelMediator extends Mediator {
    static get NAME() { return "ActionPanelMediator" };

    constructor(viewComponent) {
        super(ActionPanelMediator.NAME);
        this.subscribeNotification([
            GameCommands.SET_PLAYER_ACTION, GameCommands.DISPLAY_PLAYER_ACTION
        ]);
        this.viewComponent = viewComponent;

        this.viewComponent.on('click:actionButton', this.handleClickActionButton, this);

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.DISPLAY_PLAYER_ACTION:
                const actionName = args[0];
                this.viewComponent.script['ActionPanelComponent'].selectAction(actionName);
                break;
        }
    }


    handleClickActionButton(actionName) {
        // this.viewComponent.script['ActionPanelComponent'].selectAction(actionName);
        this.facade.sendNotification(GameCommands.SET_PLAYER_ACTION, actionName)
    }
}
