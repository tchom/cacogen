import { BaseNode } from './BaseNode';
import { BehaviourStatus } from './BehaviourStatus';

export class Sequence extends BaseNode {
    tick(tick) {
        for (const child of this.children) {
            const status = child.execute(tick);

            if (status !== BehaviourStatus.SUCCESS) {
                return status;
            }
        }

        return BehaviourStatus.SUCCESS;
    }

}