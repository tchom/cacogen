import { Facade } from '@koreez/pure-mvc';
import { GameCommands } from '../GameCommands';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../../model/gameState/GameStateVO';


export function spellSpeakToPlantCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);

    const pickedEntity = args[0];
    const hitPosition = args[1];


    if (gameStateProxy.currentMode === gameplayModeTypes.EXPLORATION && pickedEntity.tags.has('interactionObject')) {
        const pickedEntity = args[0];
        const interactionObject = pickedEntity.script['InteractionObjectComponent'];
        const dialogueTreeId = interactionObject.dialogueTreeId;
        const standingPosition = interactionObject.standingPoint.getPosition();

        facade.sendNotification(GameCommands.NAVIGATE_TO_WORLD_OBJECT, standingPosition, dialogueTreeId, "speak_plants");

    } else {

    }
}

