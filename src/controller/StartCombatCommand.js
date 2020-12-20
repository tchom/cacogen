const { Facade } = require('@koreez/pure-mvc');
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCommands } from './GameCommands';

export function startCombatCommand(multitonKey, notificationName, ...args) {
    const instigatingPartyIds = args[0];
    const facade = Facade.getInstance(multitonKey);
    facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, "Start Combat");

    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    gameStateProxy.updateGameStateType(gameplayModeTypes.COMBAT);

    // Setup the combat
    const participants = ['player'].concat(instigatingPartyIds);
    const combatProxy = new CombatProxy(participants);
    // console.log(participants);
    facade.registerProxy(combatProxy);

    facade.sendNotification(GameCommands.NEXT_COMBAT_ROUND);

}