import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';

export class IsNextToPlayer extends BaseNode {
    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        const characterId = tick.blackboard.get('characterId', tick.tree.id, false);

        const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
        const characterCurrentNode = characterProxy.currentNode;
        // find desired move position
        const playerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");
        const playerNode = playerProxy.currentNode;
        const connectedNodes = playerNode.connectedNodes;

        // Check if character is already adjacent to target
        const isAdjacent = connectedNodes.some(n => n.equals(characterCurrentNode));

        if (isAdjacent) {
            console.log("Is adjacent");
            return BehaviourStatus.SUCCESS;
        } else {
            console.log("Is not adjacent");
            return BehaviourStatus.FAILURE;
        }


    }
}