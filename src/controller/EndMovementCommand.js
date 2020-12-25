import { Facade } from "@koreez/pure-mvc";
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from "../model/gameState/GameStateVO";
import { GameCommands } from "./GameCommands";
import { CombatProxy } from '../model/combat/CombatProxy';

export function endMovementCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const id = args[0];
    const endNode = args[1];

    const gameState = facade.retrieveProxy(GameStateProxy.NAME);
    if (gameState.currentMode === gameplayModeTypes.COMBAT) {
        const combatProxy = facade.retrieveProxy(CombatProxy.NAME);

        if (combatProxy) {
            if (combatProxy.activeParticipant === "player") {
                console.log('END MOVEMENT AWAIT');
                facade.sendNotification(GameCommands.AWAIT_PLAYER_COMBAT_INPUT, id);
            } else {
                facade.sendNotification(GameCommands.END_COMBAT_TURN);
            }
        }
    }
}
