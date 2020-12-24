const { Facade } = require('@koreez/pure-mvc');
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCommands } from './GameCommands';

export function nextCombatRoundCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    const gameState = facade.retrieveProxy(GameStateProxy.NAME);
    const combatProxy = facade.retrieveProxy(CombatProxy.NAME);

    if (gameState.vo.gameplayMode === gameplayModeTypes.COMBAT) {
        combatProxy.nextRound();
        facade.sendNotification(GameCommands.NEXT_COMBAT_TURN, combatProxy.vo.nextTurnCharacterId);

    }

}