const { Facade } = require('@koreez/pure-mvc');
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCommands } from './GameCommands';

export function endCombatCommand(multitonKey, notificationName, ...args) {
    const losingTeam = args[0];
    const facade = Facade.getInstance(multitonKey);
    if (facade.hasMediator(CombatProxy.NAME)) {
        facade.removeMediator(CombatProxy.NAME);
    }

    facade.sendNotification(GameCommands.HIDE_WALKABLE_AREA);


    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    gameStateProxy.updateGameStateType(gameplayModeTypes.EXPLORATION);

    if (losingTeam === 'player_team') {
        facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `Game Over`);
    } else {
        facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `Victory`);
    }
}
