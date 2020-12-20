export const PlayerCombatInputComponent = pc.createScript('PlayerCombatInputComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameCommands } from '../../../controller/GameCommands';
import { GameFacade } from '../../../GameFacade';
import { Astar } from '../../../model/gameMap/navigation/Astar';
import { GameStateProxy } from '../../../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../../../model/gameState/GameStateVO';
import { CombatProxy } from '../../../model/combat/CombatProxy';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';

PlayerCombatInputComponent.attributes.add('moveTileTemplate', { type: 'asset', title: 'Move tile template' });
PlayerCombatInputComponent.attributes.add('tileContainer', { type: 'entity', title: 'Tile Container' });

// postInitialize code called once per entity
PlayerCombatInputComponent.prototype.initialize = function () {
    this.entity.script['GameCharacterComponent'].preregisterNotification(GameCommands.AWAIT_PLAYER_COMBAT_INPUT);
    this.entity.script['GameCharacterComponent'].preregisterNotification(GameCommands.NAVIGATE_TO_NODE);
    this.entity.script['GameCharacterComponent'].preregisterNotification(GameCommands.PC_FINISHED_MOVE);


    this.entity.on(GameCommands.AWAIT_PLAYER_COMBAT_INPUT, this.awaitPlayerInput, this);
};

PlayerCombatInputComponent.prototype.awaitPlayerInput = function (id, ...args) {
    this.showMoveableTiles(id);
}

PlayerCombatInputComponent.prototype.handleNavigateToNode = function (id, ...args) {


    const targetNode = args[0];

    const facade = Facade.getInstance(GameFacade.KEY);
    const gameState = facade.retrieveProxy(GameStateProxy.NAME).vo;
    const gameCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + id);
    const combatProxy = facade.retrieveProxy(CombatProxy.NAME);
    if (combatProxy && gameState.gameplayMode === gameplayModeTypes.COMBAT) {
        for (const node of this.moveableNodes) {
            if (node.equals(targetNode)) {
                this.handleValidMove(gameCharacterProxy, targetNode);
            }
        }
    }
}

PlayerCombatInputComponent.prototype.destroyDisplayTiles = function () {
    for (const tile of this.displayTiles) {
        tile.destroy();
    }
}

PlayerCombatInputComponent.prototype.handleFinishedMove = function (id, currentNode) {
    this.showMoveableTiles(id);
}

PlayerCombatInputComponent.prototype.handleValidMove = function (characterProxy, targetNode) {
    const vo = characterProxy.vo;
    const path = Astar.calculatePath(vo.currentNode, targetNode);
    if (path && path.length > 0) {
        vo.availableMovement -= (path.length - 1); // Detract by one... the first path node doesn't count
        vo.currentNode = targetNode;
        this.destroyDisplayTiles();

        this.entity.off(GameCommands.NAVIGATE_TO_NODE, this.handleNavigateToNode, this);
        this.entity.on(GameCommands.PC_FINISHED_MOVE, this.handleFinishedMove, this);


        this.entity.script['GameCharacterComponent'].setPath(path);
    }
}

PlayerCombatInputComponent.prototype.showMoveableTiles = function (id) {
    const facade = Facade.getInstance(GameFacade.KEY);
    const proxy = facade.retrieveProxy(GameCharacterProxy.NAME + id);
    const vo = proxy.vo;
    console.log("TILE AT AREA");
    console.log(vo.currentNode);
    console.log(this.entity.getLocalPosition());
    this.moveableNodes = Astar.breadthFirstSearch(vo.currentNode, vo.availableMovement);
    this.displayTiles = [];

    for (const node of this.moveableNodes) {
        const tile = this.moveTileTemplate.resource.instantiate();
        tile.setLocalPosition(node.x, node.y, node.z);
        this.tileContainer.addChild(tile);
        this.displayTiles.push(tile);
    }


    this.entity.on(GameCommands.NAVIGATE_TO_NODE, this.handleNavigateToNode, this);
    this.entity.off(GameCommands.PC_FINISHED_MOVE, this.handleFinishedMove, this);
}
