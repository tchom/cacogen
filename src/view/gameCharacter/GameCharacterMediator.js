
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
            GameCommands.DISPLAY_DEATH + this.id,
            GameCommands.DISPLAY_ATTACK + this.id,
            GameCommands.DISPLAY_HIT + this.id,
            GameCommands.CHARACTER_LOOK_AT + this.id,
            GameCommands.START_COMBAT,
            GameCommands.MAP_GRID_CREATED

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
            case GameCommands.MAP_GRID_CREATED:
                const gameMapProxy = this.facade.retrieveProxy(GameMapProxy.NAME);
                const gameCharacterProxy = this.facade.retrieveProxy(GameCharacterProxy.NAME + this.id);

                if (!gameCharacterProxy.currentNode) {
                    gameCharacterProxy.currentNode = gameMapProxy.findNearestNode(this.viewComponent.getLocalPosition());
                }
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
            case GameCommands.CHARACTER_LOOK_AT + this.id:
                const lookPoint = args[0];
                this.viewComponent.script['GameCharacterComponent'].lookAtPoint(lookPoint);
                break;
            case GameCommands.DISPLAY_DEATH + this.id:
                this.viewComponent.script['GameCharacterComponent'].animateDeath();
                break;
            case GameCommands.DISPLAY_ATTACK + this.id:
                this.viewComponent.script['GameCharacterComponent'].animateAttack();
                break;
            case GameCommands.DISPLAY_HIT + this.id:
                this.viewComponent.script['GameCharacterComponent'].animateHit();
                break;
            default:

                break;
        }
    }

    handleNavigateToNode(targetNode) {
        console.log("NAVIGATING TO NODE");
        const gameMapProxy = this.facade.retrieveProxy(GameMapProxy.NAME);
        const gameCharacterProxy = this.facade.retrieveProxy(GameCharacterProxy.NAME + this.id);

        if (!gameCharacterProxy.currentNode) {
            gameCharacterProxy.currentNode = gameMapProxy.findNearestNode(this.viewComponent.getLocalPosition());
        }

        const path = Astar.calculatePath(gameCharacterProxy.currentNode, targetNode);
        if (path && path.length > 0) {
            this.viewComponent.script['GameCharacterComponent'].setPath(path);
            gameCharacterProxy.currentNode = targetNode;
        }
    }

    handleNavigateAlongPath(path) {
        this.viewComponent.script['GameCharacterComponent'].setPath(path);
    }

    handleNavigateAlongPathWithPromise(path) {
        this.viewComponent.script['GameCharacterComponent'].setPath(path);

        return new Promise((resolve, reject) => {
            this.viewComponent.on('finishedMove', () => {
                resolve();
            });

            this.viewComponent.on('cancelMove', () => {
                reject();
            });
        });
    }

    updateCurrentNode(newNode) {
        this.facade.sendNotification(GameCommands.MOVED_TO_NODE + this.id, newNode);

    }

    handleFinishedMode(newNode) {
        setTimeout(() => {
            this.facade.sendNotification(GameCommands.FINISHED_MOVE, this.id, newNode);
        }, 500);
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
        const gameCharacterProxy = this.facade.retrieveProxy(GameCharacterProxy.NAME + this.id);
        gameCharacterProxy.currentNode = node;
        this.viewComponent.script['GameCharacterComponent'].stopMovement(node);
    }
}
