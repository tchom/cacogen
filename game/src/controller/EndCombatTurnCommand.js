const { Facade } = require('@koreez/pure-mvc');
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameCommands } from './GameCommands';

export function endCombatTurnCommand(multitonKey, notificationName, ...args) {
    setTimeout(() => {
        const facade = Facade.getInstance(multitonKey);
        const combatProxy = facade.retrieveProxy(CombatProxy.NAME);
        facade.sendNotification(GameCommands.HIDE_WALKABLE_AREA);
        facade.sendNotification(GameCommands.NEXT_COMBAT_TURN, combatProxy.nextTurnCharacterId);
    }, 500);
}
