import { GameCommands } from './GameCommands';
import { Facade } from '@koreez/pure-mvc';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameMapProxy } from '../model/gameMap/GameMapProxy';
import { GameCharacterMediator } from '../view/gameCharacter/GameCharacterMediator';

export function navigateThroughPortalCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const standingPosition = args[0];
    const destinationScene = args[1];
    const destinationPortal = args[2];

    const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);
    const standingNode = gameMapProxy.findNearestNode(standingPosition);
    const playerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");
    const playerMediator = facade.retrieveMediator(GameCharacterMediator.NAME + "player");

    playerMediator.moveToNodeWithPromise(standingNode)
        .then(() => {
            facade.sendNotification(GameCommands.CHANGE_SCENE, destinationScene);
        });
}