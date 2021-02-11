
import { GameCommands } from '../../controller/GameCommands';
import { StaminaBarComponent } from './StaminaBarComponent';
const { Mediator } = require('@koreez/pure-mvc');

export class StaminaBarMediator extends Mediator {
    static get NAME() { return "StaminaBarMediator" };

    constructor(viewComponent) {
        super(StaminaBarMediator.NAME);
        this.subscribeNotification([
            GameCommands.CHANGE_STAMINA + "player"
        ]);

        this.viewComponent = viewComponent;
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.CHANGE_STAMINA + "player":
                const newStamina = args[0];
                const maxStamina = args[1];
                this.viewComponent.script["StaminaBarComponent"].updateStamina(newStamina, maxStamina);
                break;
            default:
                break;
        }
    }

}
