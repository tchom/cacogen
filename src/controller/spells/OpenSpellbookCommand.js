import { SpellsProxy } from '../../model/spells/SpellsProxy';
import { GameCommands } from '../GameCommands';

const { Facade } = require('@koreez/pure-mvc');


export function openSpellbookCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const spellsProxy = facade.retrieveProxy(SpellsProxy.NAME);

    facade.sendNotification(GameCommands.DISPLAY_SPELLBOOK, spellsProxy.spellsLibrary);

}