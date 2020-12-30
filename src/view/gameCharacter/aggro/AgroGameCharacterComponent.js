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
    this.characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + id);
}

AgroGameCharacterComponent.prototype.handleMovedToNode = function (id, targetNode) {
    const facade = Facade.getInstance(GameFacade.KEY);
    const gameState = facade.retrieveProxy(GameStateProxy.NAME).vo;

    // Ignore if the player isn't exploring
    if (gameState.gameplayMode !== gameplayModeTypes.EXPLORATION || this.characterProxy.isDead) {
        return;
    }

    const currentNode = this.characterProxy.currentNode;
    const characterPoint = new pc.Vec3(currentNode.x, currentNode.y, currentNode.z);
    const targetPoint = new pc.Vec3(targetNode.x, targetNode.y, targetNode.z);

    if (characterPoint.distance(targetPoint) <= this.sightRange) {
        // Might be seen - check for walls
        const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);
        characterPoint.y += this.characterProxy.height;

        if (!gameMapProxy.rayIntersectsWall(characterPoint, targetPoint)) {
            facade.sendNotification(GameCommands.SET_CHARACTER_TO_NODE + "player", targetNode);
            facade.sendNotification(GameCommands.START_COMBAT, id);
        }
    }
}
