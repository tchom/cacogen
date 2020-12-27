import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';

export class IsTargetDead extends BaseNode {
    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        const targetId = tick.blackboard.get('target', tick.tree.id, false);

        // find desired move position
        const playerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + targetId);

        if (playerProxy.isDead) {
            return BehaviourStatus.SUCCESS;
        } else {
            return BehaviourStatus.FAILURE;
        }


    }
}