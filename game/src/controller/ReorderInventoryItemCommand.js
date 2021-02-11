const { Facade } = require('@koreez/pure-mvc');
import { GameCommands } from './GameCommands';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';

export function reorderInventoryItemCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    const playerId = args[0];
    const itemUUID = args[1];
    const newIndex = args[2];

    const gameCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + playerId);

    gameCharacterProxy.reorderInventoryItem(itemUUID, newIndex);
    facade.sendNotification(GameCommands.UPDATE_INVENTORY_PANEL, gameCharacterProxy.inventoryItems, gameCharacterProxy.equipmentSlots);
}
