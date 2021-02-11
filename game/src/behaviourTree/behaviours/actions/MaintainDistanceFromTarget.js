import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCommands } from '../../../controller/GameCommands';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';
import { Astar } from '../../../model/gameMap/navigation/Astar';

export class MaintainDistanceFromTarget extends BaseNode {
    constructor(minDistance, maxDistance) {
        super([]);
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
    }

    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        const characterId = tick.blackboard.get('characterId', tick.tree.id, false);
        const targetId = tick.blackboard.get('target', tick.tree.id, false);

        const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
        const characterCurrentNode = characterProxy.currentNode;
        const targetProxy = facade.retrieveProxy(GameCharacterProxy.NAME + targetId);
        const targetCurrentNode = targetProxy.currentNode;

        const minDistanceSqrt = Math.pow(this.minDistance, 2);
        const maxDistanceSqrt = Math.pow(this.maxDistance, 2);

        const movePointsAvailable = characterProxy.availableMovement;
        characterProxy.availableMovement = 0;

        // use up movement points
        const distanceToTarget = distanceSqrt(targetCurrentNode, characterCurrentNode);
        if (distanceToTarget >= minDistanceSqrt && distanceToTarget <= maxDistanceSqrt) {
            // already within range, get on with it
            return BehaviourStatus.FAILURE;
        } else {
            const moveableNodes = Astar.breadthFirstSearch(characterCurrentNode, movePointsAvailable);
            if (moveableNodes.length > 0) {
                if (distanceToTarget < minDistanceSqrt) {
                    // Too close
                    let node = moveableNodes.reduce((a, b) => distanceSqrt(targetCurrentNode, a) > distanceSqrt(targetCurrentNode, b) ? a : b);
                    const path = Astar.calculatePath(characterCurrentNode, node);

                    if (path && path.length > 0) {
                        // Check if the end point in adjacent to target
                        facade.sendNotification(GameCommands.NAVIGATE_ALONG_PATH + characterId, path);
                        characterProxy.currentNode = node;
                    }
                } else {
                    // Too far away
                    let node = moveableNodes.reduce((a, b) => distanceSqrt(targetCurrentNode, a) < distanceSqrt(targetCurrentNode, b) ? a : b);
                    const path = Astar.calculatePath(characterCurrentNode, node);

                    if (path && path.length > 0) {
                        // Check if the end point in adjacent to target
                        facade.sendNotification(GameCommands.NAVIGATE_ALONG_PATH + characterId, path);
                        characterProxy.currentNode = node;
                    }
                }

                return BehaviourStatus.SUCCESS;

            } else {
                return BehaviourStatus.FAILURE;
            }

        }
    }
}

function distanceSqrt(p1, p2) {
    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2);
}
