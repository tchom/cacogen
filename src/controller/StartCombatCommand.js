const { Facade } = require('@koreez/pure-mvc');
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCommands } from './GameCommands';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';

export function startCombatCommand(multitonKey, notificationName, ...args) {
    const instigatingCharacterId = args[0];
    const facade = Facade.getInstance(multitonKey);
    facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, "Start Combat");

    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    gameStateProxy.updateGameStateType(gameplayModeTypes.COMBAT);

    const instigatingCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + instigatingCharacterId);
    // Setup the combat
    const dirtyParticipants = ['player'].concat(instigatingCharacterId).concat(instigatingCharacterProxy.combatGroup);
    // remove duplicates
    const cleanParticipants = dirtyParticipants.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
    });

    for (const participant of cleanParticipants) {
        facade.sendNotification(GameCommands.END_MOVEMENT + participant);

    }

    const combatProxy = new CombatProxy(cleanParticipants);
    // console.log(participants);
    facade.registerProxy(combatProxy);

    facade.sendNotification(GameCommands.NEXT_COMBAT_ROUND);
}