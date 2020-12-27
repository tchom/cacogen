import { Facade } from "@koreez/pure-mvc";
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from "../model/gameState/GameStateVO";
import { GameCommands } from "./GameCommands";
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';

export function endMovementCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const id = args[0];
    const endNode = args[1];

    const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + id);
    characterProxy.currentNode = endNode;

    const gameState = facade.retrieveProxy(GameStateProxy.NAME);
    if (gameState.currentMode === gameplayModeTypes.COMBAT) {
        const combatProxy = facade.retrieveProxy(CombatProxy.NAME);

        if (combatProxy) {
            if (combatProxy.activeParticipant === "player") {
                facade.sendNotification(GameCommands.AWAIT_PLAYER_COMBAT_INPUT, id);
            } else {
                facade.sendNotification(GameCommands.DETERMINE_NEXT_ENEMY_ACTION, id);
            }
        }
    }
}
