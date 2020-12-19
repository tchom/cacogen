
import { GameCommands } from '../../controller/GameCommands';
import { GameMapProxy } from '../../model/gameMap/GameMapProxy';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';
import { NPCComponent } from './NPCComponent';
import { Astar } from '../../model/gameMap/navigation/Astar';
const { Mediator } = require('@koreez/pure-mvc');

export class NPCMediator extends Mediator {
    static get NAME() { return "NPCMediator" };

    constructor(id, viewComponent) {
        super(NPCMediator.NAME + id);
        this.subscribeNotification([
            GameCommands.MAP_GRID_CREATED,
            GameCommands.NAVIGATE_TO_NODE,
            GameCommands.PC_MOVED_TO_NODE
        ]);

        this.viewComponent = viewComponent;
        this.viewComponent.on('updateCurrentNode', this.updateCurrentNode, this);
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.MAP_GRID_CREATED:
                if (!this.currentNode) {
                    const gameMapProxy = this.facade.retrieveProxy(GameMapProxy.NAME);
                    this.currentNode = gameMapProxy.findNearestNode(this.viewComponent.getLocalPosition());
                    this.currentNode.occupied = true;

                    this.searchArea = Astar.breadthFirstSearch(this.currentNode, 6);
                    /*console.log(`Search size ${searchArea.length}`);
                    const app = pc.Application.getApplication();
                    const tileTemplate = app.root.findByName('TileMarker');
                    for (const node of searchArea) {
                        const newTile = tileTemplate.clone();
                        newTile.enabled = true;
                        newTile.setLocalPosition(node.x, node.y, node.z);
                    }*/

                }
                break;
            case GameCommands.NAVIGATE_TO_NODE:
                /*const node = args[0];
                this.handleNavigateToNode(node);*/
                break;
            case GameCommands.PC_MOVED_TO_NODE:
                this.lookForCharacter(args[0], args[1]);
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

            this.viewComponent.script['NPCComponent'].setPath(path)
        }
    }

    updateCurrentNode(newNode) {
        this.currentNode = newNode;
        this.currentNode.occupied = true;
    }

    lookForCharacter(id, node) {
        for (const searchNode of this.searchArea) {
            if (searchNode.equals(node)) {
                this.viewComponent.script['NPCComponent'].lookAtPoint(node);
                this.facade.sendNotification(GameCommands.START_COMBAT, this.viewComponent);
            }
        }
    }
}
