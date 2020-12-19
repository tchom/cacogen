
import { GameCommands } from '../../controller/GameCommands';
import { GameMapProxy } from '../../model/gameMap/GameMapProxy';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';
import { PlayerCharacterComponent } from './PlayerCharacterComponent';
import { Astar } from '../../model/gameMap/navigation/Astar';
const { Mediator } = require('@koreez/pure-mvc');

export class PlayerCharacterMediator extends Mediator {
    static get NAME() { return "PlayerCharacterMediator" };

    constructor() {
        super(PlayerCharacterMediator.NAME);
        this.subscribeNotification([
            GameCommands.CHANGE_SCENE_COMPLETE,
            GameCommands.NAVIGATE_TO_NODE
        ]);
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);

        const gameState = this.facade.retrieveProxy(GameStateProxy.NAME).vo;
        const app = pc.Application.getApplication();
        if (app) {
            const worldObjectsContainer = app.root.findByName("WorldObjects");
            const playerCharAsset = app.assets.get(40188403);
            const playerCharEntity = playerCharAsset.resource.instantiate();
            const pos = gameState.playerCharacter.position;
            playerCharEntity.setLocalPosition(pos.x, pos.y, pos.z);
            worldObjectsContainer.addChild(playerCharEntity);
            this.viewComponent = playerCharEntity;

            this.viewComponent.on('updateCurrentNode', this.updateCurrentNode, this);
            this.facade.sendNotification(GameCommands.SET_CAMERA_TARGET, this.viewComponent);
        }
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.NAVIGATE_TO_NODE:
                const node = args[0];
                this.handleNavigateToNode(node);
                break;
        }
    }

    handleNavigateToNode(targetNode) {
        const gameMapProxy = this.facade.retrieveProxy(GameMapProxy.NAME);

        if (!this.currentNode) {
            this.currentNode = gameMapProxy.findNearestNode(this.viewComponent.getLocalPosition());
        }

        const path = Astar.calculatePath(this.currentNode, targetNode);
        if (path.length > 0) {
            this.currentNode = targetNode;

            this.viewComponent.script['PlayerCharacterComponent'].setPath(path)
        }
    }

    updateCurrentNode(newNode) {
        this.currentNode = newNode;
    }
}
