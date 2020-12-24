
import { GameCommands } from '../../controller/GameCommands';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';
import { PlayerCombatPanelComponent } from './PlayerCombatPanelComponent';
import { InputLayerComponent } from '../inputLayer/InputLayerComponent';
const { Mediator } = require('@koreez/pure-mvc');

export class PlayerCombatPanelMediator extends Mediator {
    static get NAME() { return "PlayerCombatPanelMediator" };

    constructor(viewComponent) {
        super(PlayerCombatPanelMediator.NAME);
        this.subscribeNotification([
            GameCommands.CHANGE_SCENE_COMPLETE,
            GameCommands.AWAIT_PLAYER_COMBAT_INPUT,
            GameCommands.END_COMBAT_TURN,
        ]);

        this.viewComponent = viewComponent;

        this.viewComponent.on('click:endTurn', this.handleEndTurn, this);
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
                this.viewComponent.enabled = true;
                break;
            case GameCommands.END_COMBAT_TURN:
                this.viewComponent.enabled = false;
                break;
        }
    }

    handleEndTurn(evt) {
        this.sendNotification(GameCommands.END_COMBAT_TURN);
    }
}
