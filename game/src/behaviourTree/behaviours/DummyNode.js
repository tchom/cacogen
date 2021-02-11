import { BaseNode } from '../core/BaseNode';
import { BehaviourStatus } from '../core/BehaviourStatus';

export class DummyNode extends BaseNode {
    tick(tick) {
        console.log("TICK IS SUCCESS");
        return BehaviourStatus.SUCCESS;
    }
}