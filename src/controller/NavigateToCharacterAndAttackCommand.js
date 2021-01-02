const { Facade } = require('@koreez/pure-mvc');
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameCommands } from './GameCommands';
import { GameCharacterMediator } from '../view/gameCharacter/GameCharacterMediator';
import { Astar } from '../model/gameMap/navigation/Astar';

export function navigateToCharacterAndAttackCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    const targetCharacterId = args[0];

    const playerCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");
    const targetCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + targetCharacterId);

    const playerCharacterMediator = facade.retrieveMediator(GameCharacterMediator.NAME + "player");


    const pathToTarget = navigateToCharacter(playerCharacterProxy, targetCharacterProxy);
    if (pathToTarget) {
        playerCharacterMediator.handleNavigateAlongPathWithPromise(pathToTarget).then(() => {
            facade.sendNotification(GameCommands.RESOLVE_ATTACK, "player", targetCharacterId);
        });
    }
}

function navigateToCharacter(playerCharacterProxy, targetCharacterProxy) {
    const connectedNodes = targetCharacterProxy.currentNode.connectedNodes;
    const playerNode = playerCharacterProxy.currentNode;

    const isAdjacent = connectedNodes.some(n => n.equals(playerNode));

    if (isAdjacent) {
        // Already there
        return [playerNode];
    } else {
        const unoccupiedNodes = connectedNodes.filter(node => !node.occupied);
        if (unoccupiedNodes.length > 0) {

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
}