const { Facade } = require('@koreez/pure-mvc');
import { ItemsProxy } from '../model/items/ItemsProxy';
import { InventoryItem } from '../model/items/InventoryItem';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';

export function addItemToInventoryCommand(multitonKey, notificationName, ...args) {
    const characterId = args[0];
    const itemId = args[1];
    const facade = Facade.getInstance(multitonKey);
    const itemsProxy = facade.retrieveProxy(ItemsProxy.NAME);
    console.log(facade);
    console.log(itemsProxy);
    const gameCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
    const inventoryItem = new InventoryItem(itemsProxy.getItemData(itemId));
    gameCharacterProxy.addInventoryItem(inventoryItem);

}