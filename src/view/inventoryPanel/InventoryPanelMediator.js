
import { GameCommands } from '../../controller/GameCommands';
import { GameFacade } from '../../GameFacade';
const { Mediator } = require('@koreez/pure-mvc');

export class InventoryPanelMediator extends Mediator {
    static get NAME() { return "InventoryPanelMediator" };

    constructor(viewComponent) {
        super(InventoryPanelMediator.NAME);
        this.subscribeNotification([
            GameCommands.DISPLAY_INVENTORY_PANEL
        ]);
        this.viewComponent = viewComponent;
        this.viewComponent.on('reorderItem', this.handeReorderItem, this);
        this.viewComponent.on('equipItem', this.handleEquipItem, this);
        this.viewComponent.enabled = false;
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.DISPLAY_INVENTORY_PANEL:
                const items = args[0];
                const equippedMap = args[1];
                this.viewComponent.script["InventoryPanelComponent"].displayItems(items, equippedMap);
                this.viewComponent.enabled = true;
                break;
        }
    }

    handeReorderItem(originalIndex, newIndex) {
        this.facade.sendNotification(GameCommands.REORDER_INVETORY_ITEM, originalIndex, newIndex);
    }

    handleEquipItem(itemIndex, slotKey) {
        this.facade.sendNotification(GameCommands.EQUIP_ITEM_TO_SLOT, itemIndex, slotKey);
    }
}
