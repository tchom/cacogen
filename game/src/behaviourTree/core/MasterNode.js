import { BaseNode } from './BaseNode';
import { BehaviourStatus } from './BehaviourStatus';

export class MasterNode extends BaseNode {
    tick(tick) {
        for (const childNode of this.children) {
            childNode.execute(tick);
        }

        return BehaviourStatus.SUCCESS;
    }
}