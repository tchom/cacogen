const { Facade } = require('@koreez/pure-mvc');
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameCommands } from './GameCommands';
import { GameCharacterMediator } from '../view/gameCharacter/GameCharacterMediator';
import { Astar } from '../model/gameMap/navigation/Astar';

export function navigateToCharacterAndTalkCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    const targetCharacterId = args[0];

    const playerCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");
    const targetCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + targetCharacterId);

    const playerCharacterMediator = facade.retrieveMediator(GameCharacterMediator.NAME + "player");


    const pathToTarget = navigateToCharacter(playerCharacterProxy, targetCharacterProxy);
    if (pathToTarget) {
        playerCharacterMediator.handleNavigateAlongPathWithPromise(pathToTarget).then(() => {
            facade.sendNotification(GameCommands.START_DIALOGUE, targetCharacterId);
        });
    }
}

function navigateToCharacter(playerCharacterProxy, targetCharacterProxy) {
    const connectedNodes = targetCharacterProxy.currentNode.connectedNodes;

    const unoccupiedNodes = connectedNodes.filter(node => !node.occupied);
    if (unoccupiedNodes.length > 0) {
        const playerNode = playerCharacterProxy.currentNode;

        let shortestPath = Astar.calculatePath(playerNode, unoccupiedNodes[0]);

        for (let i = 1; i < unoccupiedNodes.length; i++) {
            const otherPath = Astar.calculatePath(playerNode, unoccupiedNodes[i]);
            if (otherPath.length < shortestPath.length) {
                shortestPath = otherPath;
            }
        }

        return shortestPath;
    }
    return undefined;
}