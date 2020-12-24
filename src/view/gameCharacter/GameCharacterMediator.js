
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
        this.viewComponent.on('finishedMove', this.handleFinishedMode, this);
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        if (this.viewComponent) {
            this.viewComponent.fire(notificationName, this.id, ...args);
        }

        switch (notificationName) {
            case GameCommands.START_COMBAT:
                this.handleStartCombat();

                break;
            default:

                break;
        }
    }

    updateCurrentNode(newNode) {
        /*const gameCharacterVO = this.facade.retrieveProxy(GameCharacterProxy.NAME + this.id).vo;
        gameCharacterVO.currentNode.occupied = false;
        gameCharacterVO.currentNode = newNode;
        gameCharacterVO.currentNode.occupied = true;
        console.log('Moved to node');
        console.log(newNode);*/
    }

    handleFinishedMode(newNode) {
        this.facade.sendNotification(GameCommands.PC_FINISHED_MOVE, newNode);
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

    }
}
