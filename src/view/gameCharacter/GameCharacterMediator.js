
import { GameCommands } from '../../controller/GameCommands';
import { GameMapProxy } from '../../model/gameMap/GameMapProxy';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';
import { GameCharacterComponent } from './GameCharacterComponent';
import { Astar } from '../../model/gameMap/navigation/Astar';
import { GameCharacterProxy } from '../../model/gameCharacter/GameCharacterProxy';
import { gameplayModeTypes } from '../../model/gameState/GameStateVO';
const { Mediator } = require('@koreez/pure-mvc');

export class GameCharacterMediator extends Mediator {
    static get NAME() { return "GameCharacterMediator_" };

    constructor(id, viewComponent, preregisteredNotifications) {
        super(GameCharacterMediator.NAME + id);
        this.id = id;

        let notifications = [
            GameCommands.CHANGE_SCENE_COMPLETE,
            GameCommands.NAVIGATE_TO_NODE + this.id,
            GameCommands.NAVIGATE_ALONG_PATH + this.id,
            GameCommands.SET_CHARACTER_TO_NODE + this.id,
            GameCommands.START_COMBAT
        ];

        notifications = notifications.concat(preregisteredNotifications);

        this.subscribeNotification(notifications);

        this.viewComponent = viewComponent;
        this.viewComponent.on('updateCurrentNode', this.updateCurrentNode, this);
        this.viewComponent.on('finishedMove', this.handleFinishedMode, this);
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        if (this.viewComponent) {
            this.viewComponent.fire(notificationName, this.id, ...args);
        }

        for (const scriptKey in this.viewComponent.script) {
            if (Object.hasOwnProperty.call(this.viewComponent.script, scriptKey)) {
                const scriptComponent = this.viewComponent.script[scriptKey];

                if (typeof scriptComponent.handleNotification === 'function') {

                    scriptComponent.handleNotification(notificationName, this.id, ...args);
                }


            }
        }

        switch (notificationName) {
            case GameCommands.START_COMBAT:
                this.handleStartCombat();

                break;
            case GameCommands.NAVIGATE_TO_NODE + this.id:
                this.handleNavigateToNode(args[0]);
                break;
            case GameCommands.NAVIGATE_ALONG_PATH + this.id:
                this.handleNavigateAlongPath(args[0]);
                break;
            case GameCommands.SET_CHARACTER_TO_NODE + this.id:
                this.handleSetCharacterToNode(args[0]);
                break;
            default:

                break;
        }
    }

    handleNavigateToNode(targetNode) {
        const gameState = this.facade.retrieveProxy(GameStateProxy.NAME).vo;
        const gameMapProxy = this.facade.retrieveProxy(GameMapProxy.NAME);
        const gameCharacterVO = this.facade.retrieveProxy(GameCharacterProxy.NAME + this.id).vo;

        if (!gameCharacterVO.currentNode) {
            gameCharacterVO.currentNode = gameMapProxy.findNearestNode(this.viewComponent.getLocalPosition());
        }

        const path = Astar.calculatePath(gameCharacterVO.currentNode, targetNode);
        if (path && path.length > 0) {
            this.viewComponent.script['GameCharacterComponent'].setPath(path);
            gameCharacterVO.currentNode = targetNode;
        }
    }

    handleNavigateAlongPath(path) {
        this.viewComponent.script['GameCharacterComponent'].setPath(path);
    }

    updateCurrentNode(newNode) {
        /*const gameCharacterVO = this.facade.retrieveProxy(GameCharacterProxy.NAME + this.id).vo;
        gameCharacterVO.currentNode.occupied = false;
        gameCharacterVO.currentNode = newNode;
        gameCharacterVO.currentNode.occupied = true;
        console.log('Moved to node');
        console.log(newNode);*/
        this.facade.sendNotification(GameCommands.MOVED_TO_NODE + this.id, newNode);

    }

    handleFinishedMode(newNode) {
        this.facade.sendNotification(GameCommands.FINISHED_MOVE, this.id, newNode);
    }

    lookForCharacter(id, node) {
        for (const searchNode of this.searchArea) {
            if (searchNode.equals(node)) {
                this.viewComponent.script['GameCharacterComponent'].lookAtPoint(node);
                this.facade.sendNotification(GameCommands.START_COMBAT, this.viewComponent, [id]);
            }
        }
    }

    handleStartCombat() {
        const gameCharacterVO = this.facade.retrieveProxy(GameCharacterProxy.NAME + this.id).vo;

        // this.viewComponent.script['GameCharacterComponent'].stopMovement(gameCharacterVO.currentNode);
    }

    handleSetCharacterToNode(node) {
        console.log('////////////');
        console.log('/// STOP ///');
        const gameCharacterVO = this.facade.retrieveProxy(GameCharacterProxy.NAME + this.id).vo;
        gameCharacterVO.currentNode = node;
        this.viewComponent.script['GameCharacterComponent'].stopMovement(node);
    }
}
