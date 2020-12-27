import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';

export class SetPlayerAsTarget extends BaseNode {
    tick(tick) {
        tick.blackboard.set('target', 'player', tick.tree.id, false);
        return BehaviourStatus.SUCCESS;
    }
}
