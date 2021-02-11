import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCommands } from '../../../controller/GameCommands';

export class RangeAttackTarget extends BaseNode {
    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        const attackerId = tick.blackboard.get('characterId', tick.tree.id, false);
        const defenderId = tick.blackboard.get('target', tick.tree.id, false);
        facade.sendNotification(GameCommands.RESOLVE_RANGED_ATTACK, attackerId, defenderId);
        return BehaviourStatus.SUCCESS;
    }
}
