import { Facade } from "@koreez/pure-mvc";
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameCommands } from './GameCommands';
import { ItemsProxy } from '../model/items/ItemsProxy';
import { InventoryItem } from "../model/items/InventoryItem";


export function equipItemToSlotCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const characterId = args[0];
    const itemId = args[1];
    const equipmentKey = args[2];
    const gameCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
    const itemInInventory = gameCharacterProxy.inventoryItems.find(item => item.id === itemId);

    if (itemInInventory) {
        const successfullyEquipped = gameCharacterProxy.attemptToEquipItemToSlot(equipmentKey, itemInInventory);

        if (successfullyEquipped) {
            if (itemInInventory.type === "weapon") {
                facade.sendNotification(GameCommands.EQUIP_WEAPON, "player", itemInInventory.id);
            }
        }
    } else {
        const itemsProxy = facade.retrieveProxy(ItemsProxy.NAME);
        const inventoryItem = new InventoryItem(itemsProxy.getItemData(itemId));

        const successfullyEquipped = gameCharacterProxy.attemptToEquipItemToSlot(equipmentKey, inventoryItem);

        if (successfullyEquipped) {
            if (inventoryItem.type === "weapon") {
                facade.sendNotification(GameCommands.EQUIP_WEAPON, "player", inventoryItem.id);
            }
        }
    }
    // const item = inventoryProxy.inventoryItems[itemIndex];



    facade.sendNotification(GameCommands.DISPLAY_EQUIPPED_SLOT, gameCharacterProxy.equipmentSlots);
    facade.sendNotification(GameCommands.UPDATE_INVENTORY_PANEL, gameCharacterProxy.inventoryItems, gameCharacterProxy.equipmentSlots);
    console.log(`Currently equipped armour: ${gameCharacterProxy.currentArmour}`);
}