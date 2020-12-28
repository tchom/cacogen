const { Facade } = require('@koreez/pure-mvc');
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { GameCommands } from './GameCommands';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { CombatProxy } from '../model/combat/CombatProxy';

export function equipWeaponCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    if (gameStateProxy.currentMode === gameplayModeTypes.COMBAT) {
        const combatProxy = facade.retrieveProxy(CombatProxy.NAME);
        if (combatProxy.activeParticipant !== "player") {
            facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `Must change weapon on your turn`);
            return;
        }
    }

    const characterId = args[0];
    const weapon = args[1];

    const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
    characterProxy.equippedWeapon = weapon;

    facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `${characterId} equips ${weapon}`);

}