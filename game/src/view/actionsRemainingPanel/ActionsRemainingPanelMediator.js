
import { GameCommands } from '../../controller/GameCommands';
import { GameCharacterProxy } from '../../model/gameCharacter/GameCharacterProxy';
const { Mediator } = require('@koreez/pure-mvc');

export class ActionsRemainingPanelMediator extends Mediator {
    static get NAME() { return "ActionsRemainingPanelMediator" };

    constructor(viewComponent) {
        super(ActionsRemainingPanelMediator.NAME);
        this.subscribeNotification([
            GameCommands.CHANGE_SCENE_COMPLETE,
            GameCommands.AWAIT_PLAYER_COMBAT_INPUT,
            GameCommands.END_COMBAT_TURN,
            GameCommands.USE_ACTION + "player"
        ]);
        this.viewComponent = viewComponent;
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.CHANGE_SCENE_COMPLETE:
                this.viewComponent.enabled = false;
                break;
            case GameCommands.AWAIT_PLAYER_COMBAT_INPUT:
                const playerProxy = this.facade.retrieveProxy(GameCharacterProxy.NAME + "player");
                const availableActions = playerProxy.availableActions;
                const maxActions = playerProxy.maxActionsPerTurn;
                this.viewComponent.script['ActionsRemainingPanelComponent'].showAvailableAction(availableActions, maxActions);
                this.viewComponent.enabled = true;
                break;
            case GameCommands.USE_ACTION + "player":
                this.viewComponent.script['ActionsRemainingPanelComponent'].showAvailableAction(args[0], args[1]);

                break;
            case GameCommands.END_COMBAT_TURN:
                this.viewComponent.enabled = false;
                break;
        }
    }
}
