import { Facade } from "@koreez/pure-mvc";
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameCommands } from './GameCommands';
import { InventoryProxy } from '../model/inventory/InventoryProxy';
import { ItemsProxy } from '../model/items/ItemsProxy';
import { InventoryItem } from "../model/inventory/items/InventoryItem";


export function equipItemToSlotCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const inventoryProxy = facade.retrieveProxy(InventoryProxy.NAME);
    const itemId = args[0];
    const equipmentKey = args[1];

    const itemInInventory = inventoryProxy.inventoryItems.find(item => item.id === itemId);

    if (itemInInventory) {
        const successfullyEquipped = inventoryProxy.attemptToEquipItemToSlot(equipmentKey, itemInInventory);

        if (successfullyEquipped) {
            if (itemInInventory.type === "weapon") {
                facade.sendNotification(GameCommands.EQUIP_WEAPON, "player", itemInInventory.id);
            }
        }
    } else {
        const itemsProxy = facade.retrieveProxy(ItemsProxy.NAME);
        const inventoryProxy = facade.retrieveProxy(InventoryProxy.NAME);
        const inventoryItem = new InventoryItem(itemsProxy.getItemData(itemId));

        const successfullyEquipped = inventoryProxy.attemptToEquipItemToSlot(equipmentKey, inventoryItem);

        if (successfullyEquipped) {
            if (inventoryItem.type === "weapon") {
                facade.sendNotification(GameCommands.EQUIP_WEAPON, "player", inventoryItem.id);
            }
        }
    }
    // const item = inventoryProxy.inventoryItems[itemIndex];



    facade.sendNotification(GameCommands.DISPLAY_EQUIPPED_SLOT, inventoryProxy.equipmentSlots);
    facade.sendNotification(GameCommands.DISPLAY_INVENTORY_PANEL, inventoryProxy.inventoryItems, inventoryProxy.equipmentSlots);

}