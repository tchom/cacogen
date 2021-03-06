
import { GameCommands } from '../../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class SpellbookPanelMediator extends Mediator {
    static get NAME() { return "SpellbookPanelMediator" };

    constructor(viewComponent) {
        super(SpellbookPanelMediator.NAME);
        this.subscribeNotification([
            GameCommands.DISPLAY_SPELLBOOK
        ]);
        this.viewComponent = viewComponent;

        this.viewComponent.on('click:cast', this.handleCast, this);

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.DISPLAY_SPELLBOOK:
                const spellsDict = args[0];
                this.viewComponent.script['SpellbookPanelComponent'].open(spellsDict);
                this.viewComponent.enabled = true;
                break;
        }
    }

    handleCast(spellKey) {
        this.facade.sendNotification(GameCommands.AWAIT_SPELL_CAST, spellKey);
        this.viewComponent.enabled = false;
    }
}
