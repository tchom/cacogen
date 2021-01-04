import { Facade } from "@koreez/pure-mvc";
import { GameStateProxy } from "../model/gameState/GameStateProxy";
import { gameplayModeTypes } from "../model/gameState/GameStateVO";
import { GameCommands } from './GameCommands';
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameMapProxy } from '../model/gameMap/GameMapProxy';

export function selectedNodeCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);


    const node = args[0];

    if (gameMapProxy.hasValidNode(node)) {
        if (gameStateProxy.currentMode === gameplayModeTypes.EXPLORATION) {
            facade.sendNotification(GameCommands.NAVIGATE_TO_WAYPOINT + "player", node);
        } else if (gameStateProxy.currentMode === gameplayModeTypes.COMBAT) {
            const combatProxy = facade.retrieveProxy(CombatProxy.NAME);
            if (combatProxy.activeParticipant === "player") {
                facade.sendNotification(GameCommands.COMBAT_NAVIGATE_TO_NODE, "player", node);
            }
        }
    }
}