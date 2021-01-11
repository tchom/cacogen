import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCommands } from '../../../controller/GameCommands';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';
import { Astar } from '../../../model/gameMap/navigation/Astar';

export class MoveTowardsTarget extends BaseNode {
    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        const characterId = tick.blackboard.get('characterId', tick.tree.id, false);
        const targetId = tick.blackboard.get('target', tick.tree.id, false);

        const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
        const characterCurrentNode = characterProxy.currentNode;
        const targetProxy = facade.retrieveProxy(GameCharacterProxy.NAME + targetId);
        const targetCurrentNode = targetProxy.currentNode;
        const connectedNodes = targetCurrentNode.connectedNodes;

        const result = connectedNodes.filter(node => !node.occupied);

        // Check there is a node to move to 
        if (result.length > 0) {
            // Find nearest node
            let node = result.reduce((a, b) => distanceSqrt(characterCurrentNode, a) < distanceSqrt(characterCurrentNode, b) ? a : b);

            const path = Astar.calculatePath(characterCurrentNode, node);
            if (path && path.length > 0) {
                // trim movement
                const vo = characterProxy.vo;
                while (path.length > vo.availableMovement) {
                    path.shift();
                }

                // Check if the end point in adjacent to target
                facade.sendNotification(GameCommands.NAVIGATE_ALONG_PATH + characterId, path);
                characterProxy.currentNode = node;

            }
        } else {
            setTimeout(() => {
                facade.sendNotification(GameCommands.DETERMINE_NEXT_ENEMY_ACTION, characterId);
            }, 500);
        }

        // use up movement points
        characterProxy.availableMovement = 0;

        return BehaviourStatus.SUCCESS;
    }
}

function distanceSqrt(p1, p2) {
    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
}
