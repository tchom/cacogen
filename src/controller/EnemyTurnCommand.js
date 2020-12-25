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
    // find desired move position
    const playerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");
    const playerNode = playerProxy.currentNode;
    const connectedNodes = playerNode.connectedNodes;

    /*for (const neighbourNodes of playerNode.connectedNodes) {
        
    }*/

    const result = connectedNodes.filter(node => !node.occupied);


    const node = result[Math.floor(result.length * Math.random())];

    const path = Astar.calculatePath(enemyProxy.currentNode, node);
    if (path && path.length > 0) {
        enemyProxy.currentNode = node;
        facade.sendNotification(GameCommands.NAVIGATE_ALONG_PATH + enemyId, path);
    } else {
        facade.sendNotification(GameCommands.END_COMBAT_TURN);
    }

    // const node = gameMapProxy.findNearestNode({ x: 0, y: 0, z: 0 });
    /*if (node) {
        facade.sendNotification(GameCommands.NAVIGATE_TO_NODE + enemyId, node);
    }*/

    /*setTimeout(() => {
        facade.sendNotification(GameCommands.END_COMBAT_TURN);
    }, 3000);*/

}