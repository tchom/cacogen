
import { GameCommands } from '../../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class UseItemButtonMediator extends Mediator {
    static get NAME() { return "UseItemButtonMediator" };

    constructor(viewComponent, equipmentSlotKey) {
        super(UseItemButtonMediator.NAME + equipmentSlotKey);
        this.equipmentSlotKey = equipmentSlotKey;

        this.subscribeNotification([
            GameCommands.GAMEPLAY_ACTION_CHANGED, GameCommands.DISPLAY_EQUIPPED_SLOT
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
        }
    }

    handleUseItem(attackEnabled) {
        if (attackEnabled) {
            this.facade.sendNotification(GameCommands.GAMEPLAY_ACTION_CHANGED, "attack");
        } else {
            this.facade.sendNotification(GameCommands.GAMEPLAY_ACTION_CHANGED, "interact");
        }
    }
}
