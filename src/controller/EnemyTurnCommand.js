const { Facade } = require('@koreez/pure-mvc');
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCommands } from './GameCommands';
import { GameMapProxy } from '../model/gameMap/GameMapProxy';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { Astar } from '../model/gameMap/navigation/Astar';

export function enemyTurnCommand(multitonKey, notificationName, ...args) {
    const enemyId = args[0];
    const facade = Facade.getInstance(multitonKey);
    const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);

    const enemyProxy = facade.retrieveProxy(GameCharacterProxy.NAME + enemyId);
    const enemyCurrentNode = enemyProxy.currentNode;
    // find desired move position
    const playerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");
    const playerNode = playerProxy.currentNode;
    const connectedNodes = playerNode.connectedNodes;

    // Check if character is already adjacent to target
    const isAdjacent = connectedNodes.some(n => n.equals(enemyCurrentNode));

    // we're already there
    if (isAdjacent) {
        facade.sendNotification(GameCommands.END_COMBAT_TURN);
        return;
    }

    const result = connectedNodes.filter(node => !node.occupied);

    if (result.length > 0) {
        // Find nearest node
        let node = result.reduce((a, b) => distanceSqrt(enemyCurrentNode, a) < distanceSqrt(enemyCurrentNode, b) ? a : b);


        const path = Astar.calculatePath(enemyCurrentNode, node);
        if (path && path.length > 0) {
            // trim movement
            const vo = enemyProxy.vo;
            while (path.length > vo.availableMovement) {
                path.shift();
            }

            // Check if the end point in adjacent to target
            const endPoint = path[0];
            const endpointIsAdjacent = connectedNodes.some(n => n.equals(endPoint));

            if (endpointIsAdjacent) {
                facade.sendNotification(GameCommands.MOVE_ALONG_PATH_AND_ATTACK, enemyId, "player", path);
            } else {
                facade.sendNotification(GameCommands.NAVIGATE_ALONG_PATH + enemyId, path);
            }


            enemyProxy.currentNode = node;

        } else {
            facade.sendNotification(GameCommands.END_COMBAT_TURN);
        }

    }

}

function distanceSqrt(p1, p2) {
    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
}
