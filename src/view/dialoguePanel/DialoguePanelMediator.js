
import { GameCommands } from '../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class DialoguePanelMediator extends Mediator {
    static get NAME() { return "DialoguePanelMediator" };

    constructor(viewComponent) {
        super(DialoguePanelMediator.NAME);
        this.subscribeNotification([
            GameCommands.SHOW_DIALOGUE_PANEL,
            GameCommands.HIDE_DIALOGUE_PANEL,
            GameCommands.DISPLAY_DIALOGUE_TEXT
        ]);
        this.viewComponent = viewComponent;

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.SHOW_DIALOGUE_PANEL:
                this.viewComponent.enabled = true;
                break;
            case GameCommands.HIDE_DIALOGUE_PANEL:
                this.viewComponent.enabled = false;
                break;
            case GameCommands.DISPLAY_DIALOGUE_TEXT:
                this.viewComponent.script['DialoguePanelComponent'].createText();
                break;
        }
    }
}
