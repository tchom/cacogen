import { GameCommands } from './GameCommands';
import { Facade } from '@koreez/pure-mvc';
import { GameMapProxy } from '../model/gameMap/GameMapProxy';
import { GameCharacterMediator } from '../view/gameCharacter/GameCharacterMediator';

export function navigateToInteractionObjectCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const standingPosition = args[0];
    const dialogueTreeId = args[1];

    const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);
    const standingNode = gameMapProxy.findNearestNode(standingPosition);
    const playerMediator = facade.retrieveMediator(GameCharacterMediator.NAME + "player");

    playerMediator.moveToNodeWithPromise(standingNode)
        .then(() => {
            facade.sendNotification(GameCommands.START_DIALOGUE, dialogueTreeId);
        });
}