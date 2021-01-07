const { Facade } = require('@koreez/pure-mvc');
import { InventoryProxy } from '../model/inventory/InventoryProxy';
import { GameCommands } from './GameCommands';

export function clickInventoryButtonCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const inventoryProxy = facade.retrieveProxy(InventoryProxy.NAME);

    facade.sendNotification(GameCommands.DISPLAY_INVENTORY_PANEL, inventoryProxy.inventoryItems);
}
