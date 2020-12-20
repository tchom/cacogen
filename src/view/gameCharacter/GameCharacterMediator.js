
import { GameCommands } from '../../controller/GameCommands';
import { GameMapProxy } from '../../model/gameMap/GameMapProxy';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';
import { GameCharacterComponent } from './GameCharacterComponent';
import { Astar } from '../../model/gameMap/navigation/Astar';
import { GameCharacterProxy } from '../../model/gameCharacter/GameCharacterProxy';
const { Mediator } = require('@koreez/pure-mvc');

export class GameCharacterMediator extends Mediator {
    static get NAME() { return "GameCharacterMediator_" };

    constructor(id, viewComponent, preregisteredNotifications) {
        super(GameCharacterMediator.NAME + id);
        this.id = id;

        let notifications = [
            GameCommands.CHANGE_SCENE_COMPLETE,
            GameCommands.NAVIGATE_TO_NODE,
            GameCommands.START_COMBAT
        ];

        notifications = notifications.concat(preregisteredNotifications);

        this.subscribeNotification(notifications);

        this.viewComponent = viewComponent;
        this.viewComponent.on('updateCurrentNode', this.updateCurrentNode, this);
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        if (this.viewComponent) {
            this.viewComponent.fire(notificationName, this.id, ...args);
        }

        switch (notificationName) {
            case GameCommands.NAVIGATE_TO_NODE:
                /*const node = args[0];
                this.handleNavigateToNode(node);*/
                break;
            case GameCommands.START_COMBAT:
                this.handleStartCombat();

                break;
            default:

                break;
        }
    }

    handleNavigateToNode(targetNode) {
        const gameMapProxy = this.facade.retrieveProxy(GameMapProxy.NAME);
        const gameCharacterVO = this.facade.retrieveProxy(GameCharacterProxy.NAME).vo;

        if (!gameCharacterVO.currentNode) {
            gameCharacterVO.currentNode = gameMapProxy.findNearestNode(this.viewComponent.getLocalPosition());
        }

        const path = Astar.calculatePath(gameCharacterVO.currentNode, targetNode);
        if (path.length > 0) {
            gameCharacterVO.currentNode = targetNode;

            this.viewComponent.script['GameCharacterComponent'].setPath(path)
        }
    }

    updateCurrentNode(newNode) {
        const gameCharacterVO = this.facade.retrieveProxy(GameCharacterProxy.NAME + this.id).vo;
        gameCharacterVO.currentNode.occupied = false;
        gameCharacterVO.currentNode = newNode;
        gameCharacterVO.currentNode.occupied = true;
    }

    lookForCharacter(id, node) {
        for (const searchNode of this.searchArea) {
            if (searchNode.equals(node)) {
                this.viewComponent.script['GameCharacterComponent'].lookAtPoint(node);
                this.facade.sendNotification(GameCommands.START_COMBAT, this.viewComponent);
            }
        }
    }

    handleStartCombat() {

    }
}
