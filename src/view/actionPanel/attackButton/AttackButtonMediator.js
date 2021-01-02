
import { GameCommands } from '../../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class AttackButtonMediator extends Mediator {
    static get NAME() { return "AttackButtonMediator" };

    constructor(viewComponent) {
        super(AttackButtonMediator.NAME);
        this.subscribeNotification([
            GameCommands.GAMEPLAY_ACTION_CHANGED
        ]);
        this.viewComponent = viewComponent;

        this.viewComponent.on('click:toggleAttack', this.handleToggleAttack, this);

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.GAMEPLAY_ACTION_CHANGED:
                const actionName = args[0];
                if (actionName === "attack") {
                    this.viewComponent.script['AttackButtonComponent'].toggleHighlight(true);
                } else {
                    this.viewComponent.script['AttackButtonComponent'].toggleHighlight(false);
                }
                break;
        }
    }

    handleToggleAttack(attackEnabled) {
        if (attackEnabled) {
            this.facade.sendNotification(GameCommands.GAMEPLAY_ACTION_CHANGED, "attack");
        } else {
            this.facade.sendNotification(GameCommands.GAMEPLAY_ACTION_CHANGED, "interact");
        }
    }
}
