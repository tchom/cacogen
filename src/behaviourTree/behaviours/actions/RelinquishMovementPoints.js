import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';

export class RelinquishMovementPoints extends BaseNode {
    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        const characterId = tick.blackboard.get('characterId', tick.tree.id, false);
        const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);

        characterProxy.availableMovement = 0;

        return BehaviourStatus.SUCCESS;

    }
}
