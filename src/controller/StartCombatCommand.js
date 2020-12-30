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
    facade.sendNotification(GameCommands.DISPLAY_FLOATING_STATUS, "spotted", instigatingCharacterProxy);


    // Setup the combat
    const teams = new Map();
    const playerTeam = ['player'];
    teams.set('player_team', playerTeam);

    const opposingTeam = [instigatingCharacterId].concat(instigatingCharacterProxy.combatGroup).filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
    });
    teams.set('opposing_team', opposingTeam);

    const participants = playerTeam.concat(opposingTeam);


    const playerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");

    for (const participant of participants) {
        facade.sendNotification(GameCommands.END_MOVEMENT + participant);
        if (participant !== "player") {
            facade.sendNotification(GameCommands.CHARACTER_LOOK_AT + participant, playerProxy.currentNode);
        } else {
            facade.sendNotification(GameCommands.CHARACTER_LOOK_AT + participant, instigatingCharacterProxy.currentNode);
        }

    }

    const combatProxy = new CombatProxy(participants, teams);
    // console.log(participants);
    facade.registerProxy(combatProxy);

    setTimeout(() => {
        facade.sendNotification(GameCommands.NEXT_COMBAT_ROUND);
    }, 2000);
}