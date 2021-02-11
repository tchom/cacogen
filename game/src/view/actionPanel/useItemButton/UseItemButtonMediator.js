
import { GameCommands } from '../../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class UseItemButtonMediator extends Mediator {
    static get NAME() { return "UseItemButtonMediator" };

    constructor(viewComponent, equipmentSlotKey) {
        super(UseItemButtonMediator.NAME + equipmentSlotKey);
        this.equipmentSlotKey = equipmentSlotKey;

        this.subscribeNotification([
            GameCommands.GAMEPLAY_ACTION_CHANGED, GameCommands.DISPLAY_EQUIPPED_SLOT,
            GameCommands.SET_USE_ITEM_BUTTON_HIGHLIGHT
        ]);
        this.viewComponent = viewComponent;

        this.viewComponent.on('click:useItem', this.handleUseItem, this);

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.GAMEPLAY_ACTION_CHANGED:
                const actionName = args[0];
                if (actionName === "attack") {
                    this.viewComponent.script['UseItemButtonComponent'].toggleHighlight(true);
                } else {
                    this.viewComponent.script['UseItemButtonComponent'].toggleHighlight(false);
                }
                break;
            case GameCommands.DISPLAY_EQUIPPED_SLOT:
                const equipmentSlots = args[0];
                const equippedData = equipmentSlots.get(this.equipmentSlotKey);
                if (equippedData && equippedData.icon) {

                    this.viewComponent.script["UseItemButtonComponent"].setIcon(equippedData.icon);
                } else {
                    this.viewComponent.script["UseItemButtonComponent"].setDefaultIcon();

                }
                break;
            case GameCommands.SET_USE_ITEM_BUTTON_HIGHLIGHT:
                const targetSlot = args[0];
                console.log(`Highlight: ${targetSlot} vs ${this.equipmentSlotKey}`);
                if (targetSlot === this.equipmentSlotKey) {
                    const isHighlighted = args[1];
                    this.viewComponent.script["UseItemButtonComponent"].toggleHighlight(isHighlighted);

                }
                break;
        }
    }

    handleUseItem() {
        this.facade.sendNotification(GameCommands.USE_EQUIPPED_ITEM, this.equipmentSlotKey);
    }
}
