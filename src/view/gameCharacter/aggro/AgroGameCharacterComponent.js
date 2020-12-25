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
    this.entity.script['GameCharacterComponent'].preregisterNotification(GameCommands.MOVED_TO_NODE + "player");

    this.entity.on(GameCommands.MAP_GRID_CREATED, this.handleMapGridCreated, this);
    this.entity.on(GameCommands.MOVED_TO_NODE + "player", this.handleMovedToNode, this);
};

AgroGameCharacterComponent.prototype.handleMapGridCreated = function (id, ...args) {
    const facade = Facade.getInstance(GameFacade.KEY);
    const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + id);
    const vo = characterProxy.vo;

    if (!vo.currentNode) {
        const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);
        characterProxy.currentNode = gameMapProxy.findNearestNode(this.entity.getLocalPosition());
        vo.agroArea = Astar.breadthFirstSearch(vo.currentNode, this.sightRange);

    }
}

AgroGameCharacterComponent.prototype.handleMovedToNode = function (id, node) {
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

            facade.sendNotification(GameCommands.SET_CHARACTER_TO_NODE + "player", node);
            // facade.sendNotification(GameCommands.NAVIGATE_TO_NODE + "player", node);
            facade.sendNotification(GameCommands.START_COMBAT, id);
        }
    }
}
