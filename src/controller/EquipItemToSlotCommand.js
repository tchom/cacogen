import { Facade } from "@koreez/pure-mvc";
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameCommands } from './GameCommands';
import { InventoryProxy } from '../model/inventory/InventoryProxy';


export function equipItemToSlotCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const inventoryProxy = facade.retrieveProxy(InventoryProxy.NAME);
    const itemIndex = args[0];
    const equipmentKey = args[1];
    const item = inventoryProxy.inventoryItems[itemIndex];

    const wasEquipped = inventoryProxy.attemptToEquipItemToSlot(equipmentKey, item);

    if (wasEquipped) {
        if (item.type === "weapon") {
            facade.sendNotification(GameCommands.EQUIP_WEAPON, "player", item.id);
        }
    }

    facade.sendNotification(GameCommands.DISPLAY_EQUIPPED_SLOT, inventoryProxy.equipmentSlots);
    facade.sendNotification(GameCommands.DISPLAY_INVENTORY_PANEL, inventoryProxy.inventoryItems, inventoryProxy.equipmentSlots);

}