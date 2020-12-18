
import { GameCommands } from '../../controller/GameCommands';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';
import { InputLayerComponent } from './InputLayerComponent';
import { PlayerCharacterMediator } from '../playerCharacter/PlayerCharacterMediator';
const { Mediator } = require('@koreez/pure-mvc');

export class InputLayerMediator extends Mediator {
    static get NAME() { return "InputLayerMediator" };

    constructor(viewComponent) {
        super(InputLayerMediator.NAME);
        this.subscribeNotification([
            GameCommands.CHANGE_SCENE_COMPLETE
        ]);
        this.viewComponent = viewComponent;
        this.viewComponent.on('validClick', this.handleClick, this);
        this.viewComponent.on('picker:navigation', this.handlePickerNavigation, this);

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.CHANGE_SCENE_COMPLETE:
                break;
        }
    }

    handleClickRaycast(clickPoint) {
        console.log("Handle valid click");
        console.log(clickPoint);
    }

    handlePickerNavigation(node) {
        this.facade.sendNotification(GameCommands.NAVIGATE_TO_NODE, node);
    }
}
