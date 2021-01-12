const { Facade } = require('@koreez/pure-mvc');
import { GameCommands } from './GameCommands';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';

export function clickInventoryButtonCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const gameCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");

    facade.sendNotification(GameCommands.DISPLAY_INVENTORY_PANEL);
    facade.sendNotification(GameCommands.UPDATE_INVENTORY_PANEL, gameCharacterProxy.inventoryItems, gameCharacterProxy.equipmentSlots);
}
