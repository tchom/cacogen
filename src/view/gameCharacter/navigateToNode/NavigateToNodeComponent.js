export const NavigateToNodeComponent = pc.createScript('NavigateToNodeComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameCommands } from '../../../controller/GameCommands';
import { GameFacade } from '../../../GameFacade';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';
import { GameMapProxy } from '../../../model/gameMap/GameMapProxy';
import { Astar } from '../../../model/gameMap/navigation/Astar';
import { GameStateProxy } from '../../../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../../../model/gameState/GameStateVO';

// initialize code called once per entity
NavigateToNodeComponent.prototype.initialize = function () {
    this.entity.script['GameCharacterComponent'].preregisterNotification(GameCommands.NAVIGATE_TO_NODE);
    this.entity.script['GameCharacterComponent'].preregisterNotification(GameCommands.START_COMBAT);

    this.entity.on(GameCommands.NAVIGATE_TO_NODE, this.handleNavigateToNode, this);
    this.entity.on(GameCommands.START_COMBAT, this.handleStartCombat, this);

    this.entity.on('updateCurrentNode', this.updateCurrentNode, this);
};

NavigateToNodeComponent.prototype.handleNavigateToNode = function (id, ...args) {
    const targetNode = args[0];
    const facade = Facade.getInstance(GameFacade.KEY);
    const gameState = facade.retrieveProxy(GameStateProxy.NAME).vo;
    if (gameState.gameplayMode === gameplayModeTypes.EXPLORATION) {
        const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);
        const gameCharacterVO = facade.retrieveProxy(GameCharacterProxy.NAME + id).vo;

        if (!gameCharacterVO.currentNode) {
            gameCharacterVO.currentNode = gameMapProxy.findNearestNode(this.entity.getLocalPosition());
        }

        const path = Astar.calculatePath(gameCharacterVO.currentNode, targetNode);
        if (path && path.length > 0) {
            gameCharacterVO.currentNode = targetNode;

            this.entity.script['GameCharacterComponent'].setPath(path);
        }
    }
}

NavigateToNodeComponent.prototype.updateCurrentNode = function (node) {
    const id = this.entity.script['GameCharacterComponent'].characterId;
    const facade = Facade.getInstance(GameFacade.KEY);
    facade.sendNotification(GameCommands.PC_MOVED_TO_NODE, id, node);
}

NavigateToNodeComponent.prototype.handleStartCombat = function () {
    const id = this.entity.script['GameCharacterComponent'].characterId;
    const facade = Facade.getInstance(GameFacade.KEY);
    const gameCharacterVO = facade.retrieveProxy(GameCharacterProxy.NAME + id).vo;

    this.entity.script['GameCharacterComponent'].stopMovement(gameCharacterVO.currentNode);

}