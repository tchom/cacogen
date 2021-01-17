
import { GameCommands } from '../../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class OpenSpellbookButtonMediator extends Mediator {
    static get NAME() { return "OpenSpellbookButtonMediator" };

    constructor(viewComponent) {
        super(OpenSpellbookButtonMediator.NAME);
        this.subscribeNotification([
            GameCommands.GAMEPLAY_ACTION_CHANGED
        ]);
        this.viewComponent = viewComponent;

        this.viewComponent.on('click:openSpellbook', this.handleOpenSpellbook, this);

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.GAMEPLAY_ACTION_CHANGED:
                const actionName = args[0];
                if (actionName === "cast_spell") {
                    this.viewComponent.script['OpenSpellbookButtonComponent'].toggleHighlight(true);
                } else {
                    this.viewComponent.script['OpenSpellbookButtonComponent'].toggleHighlight(false);
                }
                break;
        }
    }

    handleOpenSpellbook(isVisible) {
        this.facade.sendNotification(GameCommands.OPEN_SPELLBOOK, isVisible);
    }
}
