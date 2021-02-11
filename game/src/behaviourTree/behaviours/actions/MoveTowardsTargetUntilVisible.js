import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCommands } from '../../../controller/GameCommands';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';
import { Astar } from '../../../model/gameMap/navigation/Astar';
import { GameMapProxy } from '../../../model/gameMap/GameMapProxy';
import { centerPointCharacterProxy } from '../../../utils/CharacterCenterPoint';

export class MoveTowardsTargetUntilVisible extends BaseNode {
    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        const characterId = tick.blackboard.get('characterId', tick.tree.id, false);
        const targetId = tick.blackboard.get('target', tick.tree.id, false);

        const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
        const characterCurrentNode = characterProxy.currentNode;
        const targetProxy = facade.retrieveProxy(GameCharacterProxy.NAME + targetId);
        const targetNode = targetProxy.currentNode;
        const connectedNodes = targetNode.connectedNodes;


        const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);


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

                const toPos = centerPointCharacterProxy(targetProxy);

                // Follow path to see if target is visible from any point
                let deleteCount = 0;
                for (let i = path.length - 1; i >= 0; i--) {
                    const pathNode = path[i];

                    const fromPos = new pc.Vec3(pathNode.x,
                        pathNode.y + characterProxy.height * 0.5,
                        pathNode.z);

                    const canSeeTarget = !gameMapProxy.rayIntersectsWall(fromPos, toPos);
                    if (canSeeTarget) {
                        deleteCount = i;
                        break;
                    };

                }

                // Trim to point of visibility
                path.splice(0, deleteCount);

                // Check if the end point in adjacent to target
                facade.sendNotification(GameCommands.NAVIGATE_ALONG_PATH + characterId, path);
                characterProxy.currentNode = node;

            }
        }

        // use up movement points
        characterProxy.availableMovement = 0;

        return BehaviourStatus.SUCCESS;
    }
}

function distanceSqrt(p1, p2) {
    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
}
