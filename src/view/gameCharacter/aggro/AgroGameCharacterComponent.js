export const AgroGameCharacterComponent = pc.createScript('AgroGameCharacterComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameCommands } from '../../../controller/GameCommands';
import { GameFacade } from '../../../GameFacade';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';
import { GameMapProxy } from '../../../model/gameMap/GameMapProxy';
import { Astar } from '../../../model/gameMap/navigation/Astar';
import { GameStateProxy } from '../../../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../../../model/gameState/GameStateVO';

AgroGameCharacterComponent.attributes.add("sightRange", {
    type: "number",
    title: "Sight Range",
    default: 5
});

// initialize code called once per entity
AgroGameCharacterComponent.prototype.initialize = function () {
    this.entity.script['GameCharacterComponent'].preregisterNotification(GameCommands.MAP_GRID_CREATED);
    this.entity.script['GameCharacterComponent'].preregisterNotification(GameCommands.PC_MOVED_TO_NODE);

    this.entity.on(GameCommands.MAP_GRID_CREATED, this.handleMapGridCreated, this);
    this.entity.on(GameCommands.PC_MOVED_TO_NODE, this.handleMovedToNode, this);
};

AgroGameCharacterComponent.prototype.handleMapGridCreated = function (id, ...args) {
    const facade = Facade.getInstance(GameFacade.KEY);
    const vo = facade.retrieveProxy(GameCharacterProxy.NAME + id).vo;

    if (!vo.currentNode) {
        const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);
        vo.currentNode = gameMapProxy.findNearestNode(this.entity.getLocalPosition());
        vo.currentNode.occupied = true;
        vo.agroArea = Astar.breadthFirstSearch(vo.currentNode, this.sightRange);

    }

}

AgroGameCharacterComponent.prototype.handleMovedToNode = function (id, targetId, node) {
    const facade = Facade.getInstance(GameFacade.KEY);
    const vo = facade.retrieveProxy(GameCharacterProxy.NAME + id).vo;
    const gameState = facade.retrieveProxy(GameStateProxy.NAME).vo;

    // Ignore if the player isn't exploring
    if (gameState.gameplayMode !== gameplayModeTypes.EXPLORATION) {
        return;
    }

    for (const agroNode of vo.agroArea) {
        if (agroNode.equals(node)) {
            this.entity.script['GameCharacterComponent'].lookAtPoint(node);

            facade.sendNotification(GameCommands.START_COMBAT, id);
        }
    }
}
