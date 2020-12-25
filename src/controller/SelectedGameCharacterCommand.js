import { Facade } from '@koreez/pure-mvc';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { Astar } from '../model/gameMap/navigation/Astar';
import { GameCommands } from './GameCommands';

export function selectedGameCharacterCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const gameCharacterEntity = args[0];
    const id = gameCharacterEntity.script['GameCharacterComponent'].characterId;
    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    const targetCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + id);
    const playerCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");

    if (gameStateProxy.currentMode === gameplayModeTypes.EXPLORATION) {

        const pathToTarget = navigateToCharacterInExploration(playerCharacterProxy, targetCharacterProxy);
        if (pathToTarget) {
            facade.sendNotification(GameCommands.NAVIGATE_ALONG_PATH + "player", pathToTarget);

        }

    } else if (gameStateProxy.currentMode === gameplayModeTypes.COMBAT) {
        console.log("GOT YOU MOTHER FUCKER");
        const pathToTarget = navigateToCharacterInExploration(playerCharacterProxy, targetCharacterProxy);
        if (pathToTarget && pathToTarget.length <= playerCharacterProxy.vo.availableMovement) {
            facade.sendNotification(GameCommands.COMBAT_NAVIGATE_TO_NODE, "player", pathToTarget.shift());
        } else {
            facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, "Cannot reach target");
        }
    }

}

function navigateToCharacterInExploration(playerCharacterProxy, targetCharacterProxy) {
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

function navigateToCharacterInCombat(playerCharacterProxy, targetCharacterProxy) {
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
}