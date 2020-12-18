
import { GameCommands } from '../../controller/GameCommands';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';
import { GameMapComponent } from './GameMapComponent';
import { PlayerCharacterMediator } from '../playerCharacter/PlayerCharacterMediator';
import { InputLayerComponent } from '../inputLayer/InputLayerComponent';
const { Mediator } = require('@koreez/pure-mvc');

export class GameMapMediator extends Mediator {
    static get NAME() { return "GameMapMediator" };

    constructor(mapGrid) {
        super(GameMapMediator.NAME);
        this.subscribeNotification([
            GameCommands.CHANGE_SCENE_COMPLETE
        ]);
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);

        this.facade.registerMediator(new PlayerCharacterMediator());
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.CHANGE_SCENE_COMPLETE:
                const gameState = this.facade.retrieveProxy(GameStateProxy.NAME).vo;
                const app = pc.Application.getApplication();
                if (app) {
                    const playerCharAsset = app.assets.get(40188403);
                    const playerCharEntity = playerCharAsset.resource.instantiate();
                    playerCharEntity.setLocalPosition(gameState.playerCharacter.position)

                }

                break;
        }
    }
}
