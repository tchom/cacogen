import { BaseNode } from './BaseNode';
import { BehaviourStatus } from './BehaviourStatus';

export class MemPriority extends BaseNode {
    open(tick) {
        tick.blackboard.set('runningChild', 0, tick.tree.id, this.id);
    }

    tick(tick) {
        const child = tick.blackboard.get('runningChild', tick.tree.id, this.id);

        for (let i = child; i < this.children.length; i++) {
            let status = this.children[i].execute(tick);

            if (status !== BehaviourStatus.FAILURE) {
                if (status === BehaviourStatus.RUNNING) {
                    tick.blackboard.set('runningChild', i, tick.tree.id, this.id);
                }
                return status;
            }
        }

        return BehaviourStatus.FAILURE;
    }

}