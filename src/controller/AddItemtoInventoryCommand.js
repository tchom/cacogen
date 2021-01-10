const { Facade } = require('@koreez/pure-mvc');
import { GameMapProxy } from '../model/gameMap/GameMapProxy';
import { ItemsProxy } from '../model/items/ItemsProxy';
import { InventoryProxy } from '../model/inventory/InventoryProxy';
import { InventoryItem } from '../model/inventory/items/InventoryItem';

export function addItemToInventoryCommand(multitonKey, notificationName, ...args) {
    const itemId = args[0];
    const facade = Facade.getInstance(multitonKey);
    const itemsProxy = facade.retrieveProxy(ItemsProxy.NAME);
    const inventoryProxy = facade.retrieveProxy(InventoryProxy.NAME);
    const inventoryItem = new InventoryItem(itemsProxy.getItemData(itemId));
    inventoryProxy.addInventoryItem(inventoryItem);

}