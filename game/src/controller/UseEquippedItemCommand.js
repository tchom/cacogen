const { Facade } = require('@koreez/pure-mvc');
import { GameCommands } from './GameCommands';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';

export function useEquippedItemCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const gameCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");
    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);

    const equipmentSlotKey = args[0];
    const equippedItem = gameCharacterProxy.getEquippedItem(equipmentSlotKey);

    if (equippedItem) {
        if (equippedItem.type === "weapon") {
            if (gameStateProxy.currentAction !== "attack") {
                facade.sendNotification(GameCommands.EQUIP_WEAPON, "player", equippedItem.id);
                gameStateProxy.currentAction = "attack";
                facade.sendNotification(GameCommands.SET_USE_ITEM_BUTTON_HIGHLIGHT, equipmentSlotKey, true);

            } else {
                gameStateProxy.currentAction = "interact";
                facade.sendNotification(GameCommands.SET_USE_ITEM_BUTTON_HIGHLIGHT, equipmentSlotKey, false);
            }
        }
    }
}
