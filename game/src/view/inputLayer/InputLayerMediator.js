
import { GameCommands } from '../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class InputLayerMediator extends Mediator {
    static get NAME() { return "InputLayerMediator" };

    constructor(viewComponent) {
        super(InputLayerMediator.NAME);
        this.subscribeNotification([
        ]);
        this.viewComponent = viewComponent;
        this.viewComponent.on('picker:worldInput', this.prcoessWorldInput, this);
        this.viewComponent.on('scrolling', this.handleScrolling, this);

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {

        }
    }

    prcoessWorldInput(pickedEntity, hitPoint) {
        this.facade.sendNotification(GameCommands.HANDLE_WORLD_INPUT, pickedEntity, hitPoint);
    }

    handlePickerGameCharacter(characterEntity) {
        this.facade.sendNotification(GameCommands.SELECT_GAME_CHARACTER, characterEntity);
    }

    handlePickerNavigation(node) {
        this.facade.sendNotification(GameCommands.SELECTED_NODE, node);
    }

    handleScrolling(direction) {
        this.facade.sendNotification(GameCommands.INPUT_DRAG_MOUSE, direction);

    }
}
