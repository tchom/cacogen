import { SpellsProxy } from '../../model/spells/SpellsProxy';
import { GameCommands } from '../GameCommands';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';

const { Facade } = require('@koreez/pure-mvc');

export function awaitSpellCastCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const spellKey = args[0];
    const spellProxy = facade.retrieveProxy(SpellsProxy.NAME);
    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    console.log(args);
    console.log(`Spell: ${spellKey}.`);
    const spellsData = spellProxy.retieveSpellDefinition(spellKey);
    console.log(spellsData);

    gameStateProxy.currentAction = "cast_spell";
    gameStateProxy.selectedSpellCommand = spellsData.command;

    facade.sendNotification(GameCommands.GAMEPLAY_ACTION_CHANGED, "cast_spell");

}