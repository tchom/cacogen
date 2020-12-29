import { Facade } from '@koreez/pure-mvc';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { Astar } from '../model/gameMap/navigation/Astar';
import { GameCommands } from './GameCommands';
import { CombatProxy } from '../model/combat/CombatProxy';
import { WeaponsProxy } from '../model/weapons/WeaponsProxy';
import { centerPointCharacterProxy } from '../utils/CharacterCenterPoint';
import { GameMapProxy } from '../model/gameMap/GameMapProxy';

export function selectedGameCharacterCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const gameCharacterEntity = args[0];
    const id = gameCharacterEntity.script['GameCharacterComponent'].characterId;
    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);
    const targetCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + id);
    const playerCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");

    const weaponProxy = facade.retrieveProxy(WeaponsProxy.NAME);
    const weaponCategory = weaponProxy.getWeaponCategory(playerCharacterProxy.equippedWeapon);

    if (gameStateProxy.currentMode === gameplayModeTypes.EXPLORATION) {
        if (gameStateProxy.currentAction === 'attack' && weaponCategory === "ranged") {
            if (canSeeTarget(gameMapProxy, playerCharacterProxy, targetCharacterProxy)) {
                facade.sendNotification(GameCommands.RESOLVE_RANGED_ATTACK, "player", id);
                facade.sendNotification(GameCommands.START_COMBAT, id);
            } else {
                facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, "No line of sight");
            }
        } else {
            const pathToTarget = navigateToCharacter(playerCharacterProxy, targetCharacterProxy);
            if (pathToTarget) {
                facade.sendNotification(GameCommands.NAVIGATE_ALONG_PATH + "player", pathToTarget);

            }
        }
    } else if (gameStateProxy.currentMode === gameplayModeTypes.COMBAT) {
        const combatProxy = facade.retrieveProxy(CombatProxy.NAME);
        if (!combatProxy || combatProxy.activeParticipant !== "player") {
            // not your turn
            return;
        }

        if (playerCharacterProxy.availableActions <= 0) {
            // out of actions
            facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, "Out of actions");
            return;
        }

        if (weaponCategory === "ranged") {
            if (canSeeTarget(gameMapProxy, playerCharacterProxy, targetCharacterProxy)) {
                facade.sendNotification(GameCommands.RESOLVE_RANGED_ATTACK, "player", id);
            } else {
                facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, "No line of sight");
            }
        } else {
            if (!isTargetAdjacent(playerCharacterProxy, targetCharacterProxy)) {
                const pathToTarget = navigateToCharacter(playerCharacterProxy, targetCharacterProxy);
                // path length includes current node, so deduct on to work out actual moveable distance
                if (pathToTarget && pathToTarget.length - 1 <= playerCharacterProxy.vo.availableMovement) {
                    if (gameStateProxy.currentAction === 'attack') {

                        // Get weapon type
                        facade.sendNotification(GameCommands.MOVE_ALONG_PATH_AND_ATTACK, "player", targetCharacterProxy.id, pathToTarget);


                    } else {
                        facade.sendNotification(GameCommands.COMBAT_NAVIGATE_TO_NODE, "player", pathToTarget.shift());
                    }
                } else {
                    facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, "Cannot reach target");
                }
            } else if (gameStateProxy.currentAction === 'attack') {
                if (gameStateProxy.currentAction === 'attack') {
                    facade.sendNotification(GameCommands.RESOLVE_ATTACK, playerCharacterProxy.id, targetCharacterProxy.id);
                }
            }
        }
    }
}

function navigateToCharacter(playerCharacterProxy, targetCharacterProxy) {
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

function isTargetAdjacent(playerCharacterProxy, targetCharacterProxy) {
    const targetCurrrentNode = targetCharacterProxy.currentNode;
    const connectedNodes = playerCharacterProxy.currentNode.connectedNodes;
    return connectedNodes.some(n => n.equals(targetCurrrentNode));
}

function canSeeTarget(gameMapProxy, playerCharacterProxy, targetCharacterProxy) {
    const playerPoint = centerPointCharacterProxy(playerCharacterProxy);
    const targetPoint = centerPointCharacterProxy(targetCharacterProxy);

    return !gameMapProxy.rayIntersectsWall(playerPoint, targetPoint);
}