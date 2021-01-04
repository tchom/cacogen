
import { GameCommands } from '../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class DialoguePanelMediator extends Mediator {
    static get NAME() { return "DialoguePanelMediator" };

    constructor(viewComponent) {
        super(DialoguePanelMediator.NAME);
        this.subscribeNotification([
            GameCommands.SHOW_DIALOGUE_PANEL,
            GameCommands.HIDE_DIALOGUE_PANEL,
            GameCommands.DISPLAY_DIALOGUE_STEP,
            GameCommands.DISPLAY_DIALOGUE_SKILL_TEST,
            GameCommands.CLEAR_DIALOGUE_CHOICES,
            GameCommands.SHOW_DIALOGUE_CONTINUE_BUTTON,
            GameCommands.HIDE_DIALOGUE_CONTINUE_BUTTON
        ]);
        this.viewComponent = viewComponent;

        this.viewComponent.on('clicked:continue', this.handleClickContinue, this);
        this.viewComponent.on('clicked:choice', this.handleClickChoice, this);

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
                this.viewComponent.script['DialoguePanelComponent'].clearPanel();
                this.viewComponent.enabled = false;
                break;
            case GameCommands.DISPLAY_DIALOGUE_STEP:
                this.viewComponent.script['DialoguePanelComponent'].createStep(args[0]);
                break;
            case GameCommands.DISPLAY_DIALOGUE_SKILL_TEST:
                this.viewComponent.script['DialoguePanelComponent'].createSkillTest(...args);
                break;
            case GameCommands.CLEAR_DIALOGUE_CHOICES:
                this.viewComponent.script['DialoguePanelComponent'].clearDialogueChoices();
                break;
            case GameCommands.SHOW_DIALOGUE_CONTINUE_BUTTON:
                this.viewComponent.script['DialoguePanelComponent'].setContinueButton(true);
                break;
            case GameCommands.HIDE_DIALOGUE_CONTINUE_BUTTON:
                this.viewComponent.script['DialoguePanelComponent'].setContinueButton(false);

                break;
        }
    }

    handleClickContinue() {
        this.facade.sendNotification(GameCommands.CONTINUE_DIALOGUE_NODE);
    }

    handleClickChoice(index) {
        this.facade.sendNotification(GameCommands.SELECT_DIALOGUE_CHOICE, index);
    }
}
