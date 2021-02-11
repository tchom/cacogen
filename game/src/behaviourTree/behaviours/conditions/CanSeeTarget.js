import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';
import { GameMapProxy } from '../../../model/gameMap/GameMapProxy';
import { centerPointCharacterProxy } from '../../../utils/CharacterCenterPoint';

export class CanSeeTarget extends BaseNode {
    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        const characterId = tick.blackboard.get('characterId', tick.tree.id, false);
        const targetId = tick.blackboard.get('target', tick.tree.id, false);

        const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
        const characterCurrentNode = characterProxy.currentNode;
        // find desired move position
        const targetProxy = facade.retrieveProxy(GameCharacterProxy.NAME + targetId);
        const targetNode = targetProxy.currentNode;

        const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);

        // Look to the center of each character
        const fromPos = centerPointCharacterProxy(characterProxy);
        const toPos = centerPointCharacterProxy(targetProxy);

        const canSeeTarget = !gameMapProxy.rayIntersectsWall(fromPos, toPos);
        if (canSeeTarget) {
            return BehaviourStatus.SUCCESS;
        } else {
            return BehaviourStatus.FAILURE;

        }
    }
}