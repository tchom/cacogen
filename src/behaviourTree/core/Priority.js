import { BaseNode } from './BaseNode';
import { BehaviourStatus } from './BehaviourStatus';

export class Priority extends BaseNode {
    tick(tick) {
        for (const child of this.children) {
            const status = child.execute(tick);

            if (status !== BehaviourStatus.FAILURE) {
                return status;
            }
        }

        return BehaviourStatus.FAILURE;
    }

}