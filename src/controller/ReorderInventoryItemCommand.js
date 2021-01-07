const { Facade } = require('@koreez/pure-mvc');
import { InventoryProxy } from '../model/inventory/InventoryProxy';
import { GameCommands } from './GameCommands';

export function reorderInventoryItemCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const inventoryProxy = facade.retrieveProxy(InventoryProxy.NAME);

    const originalIndex = args[0];
    const newIndex = args[1];

    inventoryProxy.reorderInventoryItem(originalIndex, newIndex);

    facade.sendNotification(GameCommands.DISPLAY_INVENTORY_PANEL, inventoryProxy.inventoryItems);
}
