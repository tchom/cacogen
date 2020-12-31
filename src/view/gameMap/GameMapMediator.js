
import { GameCommands } from '../../controller/GameCommands';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';
import { GameMapComponent } from './GameMapComponent';
import { InputLayerComponent } from '../inputLayer/InputLayerComponent';
const { Mediator } = require('@koreez/pure-mvc');

export class GameMapMediator extends Mediator {
    static get NAME() { return "GameMapMediator" };

    constructor(viewComponent) {
        super(GameMapMediator.NAME);
        this.subscribeNotification([
            GameCommands.CHANGE_SCENE_COMPLETE
        ]);

        this.viewComponent = viewComponent;

    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
        this.facade.sendNotification(GameCommands.PARSE_GAMEMAP);

    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.CHANGE_SCENE_COMPLETE:
                const gameState = this.facade.retrieveProxy(GameStateProxy.NAME).vo;
                const app = pc.Application.getApplication();
                if (app) {

                }

                break;
        }
    }
}
