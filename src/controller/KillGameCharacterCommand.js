import { Facade } from "@koreez/pure-mvc";
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameCommands } from './GameCommands';


export function killGameCharacterCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const characterId = args[0];
    const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
    facade.sendNotification(GameCommands.DISPLAY_FLOATING_STATUS, "death", characterProxy);

    if (characterProxy) {
        characterProxy.currentNode.occupied = false;
    }

    const combatProxy = facade.retrieveProxy(CombatProxy.NAME);
    if (combatProxy) {
        combatProxy.removeCharacterFromCombat(characterId);
    }

}