const { Facade } = require('@koreez/pure-mvc');
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCommands } from './GameCommands';

export function endCombatCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    if (facade.hasMediator(CombatProxy.NAME)) {
        facade.removeMediator(CombatProxy.NAME);
    }

    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    gameStateProxy.updateGameStateType(gameplayModeTypes.EXPLORATION);
}
