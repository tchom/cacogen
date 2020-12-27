
import { BaseNode } from '../BaseNode';
import { BehaviourStatus } from '../BehaviourStatus';
export class Inverter extends BaseNode {
    tick(tick) {

        // presume inverter has one child
        const child = this.children[0];

        if (!child) {
            return BehaviourStatus.ERROR;
        }

        let status = child.execute(tick);

        if (status == BehaviourStatus.SUCCESS)
            status = BehaviourStatus.FAILURE;
        else if (status == BehaviourStatus.FAILURE)
            status = BehaviourStatus.SUCCESS;

        return status;
    }
}