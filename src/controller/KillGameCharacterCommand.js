import { Facade } from "@koreez/pure-mvc";
import { CombatProxy } from '../model/combat/CombatProxy';


export function killGameCharacterCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const characterId = args[0];

    const combatProxy = facade.retrieveProxy(CombatProxy.NAME);
    if (combatProxy) {
        combatProxy.removeCharacterFromCombat(characterId);
    }

}