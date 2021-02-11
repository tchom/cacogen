
import { GameCommands } from '../../controller/GameCommands';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../../model/gameState/GameStateVO';
const { Mediator } = require('@koreez/pure-mvc');

export class InteractionObjectMediator extends Mediator {
    static get NAME() { return "InteractionObjectMediator" };


    constructor(viewComponent) {
        super(InteractionObjectMediator.NAME);
        this.subscribeNotification([
            // GameCommands.SHOW_TOAST_MESSAGE
        ]);

        this.viewComponent = viewComponent;
        this.viewComponent.on('picker:interactionObject', this.selectInteractionObject, this);

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.SET_CAMERA_TARGET:
                break;
        }
    }

    selectInteractionObject() {
        const gameStateProxy = this.facade.retrieveProxy(GameStateProxy.NAME);
        const interactionObjectComponent = this.viewComponent.script['InteractionObjectComponent'];
        const dialogueTreeId = interactionObjectComponent.dialogueTreeId;
        const standingPosition = interactionObjectComponent.standingPoint.getPosition();

        if (gameStateProxy.currentMode === gameplayModeTypes.EXPLORATION) {
            this.facade.sendNotification(GameCommands.NAVIGATE_TO_WORLD_OBJECT,
                standingPosition, dialogueTreeId);
        }
    }
}