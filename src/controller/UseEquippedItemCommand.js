const { Facade } = require('@koreez/pure-mvc');
import { InventoryProxy } from '../model/inventory/InventoryProxy';
import { GameCommands } from './GameCommands';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';

export function useEquippedItemCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const inventoryProxy = facade.retrieveProxy(InventoryProxy.NAME);
    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);

    const equipmentSlotKey = args[0];
    const equippedItem = inventoryProxy.getEquippedItem(equipmentSlotKey);

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
