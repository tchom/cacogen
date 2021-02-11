import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';

export class IsDead extends BaseNode {
    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        const characterId = tick.blackboard.get('characterId', tick.tree.id, false);

        // find desired move position
        const playerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);

        if (playerProxy.isDead) {
            return BehaviourStatus.SUCCESS;
        } else {
            return BehaviourStatus.FAILURE;
        }


    }
}