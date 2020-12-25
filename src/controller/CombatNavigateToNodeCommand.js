const { Facade } = require('@koreez/pure-mvc');
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCommands } from './GameCommands';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { Astar } from '../model/gameMap/navigation/Astar';

export function combatNavigateToNodeCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const id = args[0];
    const targetNode = args[1];

    const gameCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + id);
    const vo = gameCharacterProxy.vo;
    const moveableNodes = Astar.breadthFirstSearch(vo.currentNode, vo.availableMovement);

    for (const node of moveableNodes) {
        if (node.equals(targetNode)) {
            handleValidMove(facade, gameCharacterProxy, targetNode);
        }
    }
    const gameState = facade.retrieveProxy(GameStateProxy.NAME);
    const combatProxy = facade.retrieveProxy(CombatProxy.NAME);


}

function handleValidMove(facade, characterProxy, targetNode) {
    const vo = characterProxy.vo;
    const path = Astar.calculatePath(vo.currentNode, targetNode);
    if (path && path.length > 0) {
        vo.availableMovement -= (path.length - 1); // Detract by one... the first path node doesn't count
        characterProxy.currentNode = targetNode;
        facade.sendNotification(GameCommands.NAVIGATE_ALONG_PATH + vo.id, path);
    }
}