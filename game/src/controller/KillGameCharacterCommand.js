import { Facade } from "@koreez/pure-mvc";
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameCommands } from './GameCommands';


export function killGameCharacterCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const characterId = args[0];
    console.log(`Kill character:: ${characterId}`);
    const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
    facade.sendNotification(GameCommands.DISPLAY_FLOATING_STATUS, "death", characterProxy);
    facade.sendNotification(GameCommands.DISPLAY_DEATH + characterId);


    if (characterProxy) {
        characterProxy.currentStamina = 0;
        characterProxy.currentNode.occupied = false;
    }

    const combatProxy = facade.retrieveProxy(CombatProxy.NAME);
    if (combatProxy) {
        combatProxy.removeCharacterFromCombat(characterId);
    }

}