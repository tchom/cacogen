import { BehaviourStatus } from './BehaviourStatus';
import { createUUID } from '../../utils/GUID';

export class BaseNode {
    constructor(children) {
        this.initialize(children);
    }

    initialize(children) {
        this.id = createUUID();
        this.children = children || [];
    }

    execute(tick) {
        /* ENTER */
        this._enter(tick);

        /* OPEN */
        if (!tick.blackboard.get('isOpen', tick.tree.id, this.id)) {
            this._open(tick);
        }

        /* TICK */
        const status = this._tick(tick);

        /* CLOSE */
        if (status !== BehaviourStatus.RUNNING) {
            this._close(tick);
        }

        /* EXIT */
        this._exit(tick);

        return status;
    }

    _enter(tick) {
        tick.enterNode(this);
        this.enter(tick);
    }

    _open(tick) {
        tick.openNode(this);
        tick.blackboard.set('isOpen', true, tick.tree.id, this.id);
        this.open(tick);
    }

    _tick(tick) {
        tick.tickNode(this);
        return this.tick(tick);
    }

    _close(tick) {
        tick.closeNode(this);
        tick.blackboard.set('isOpen', false, tick.tree.id, this.id);
        this.close(tick);
    }

    _exit(tick) {
        tick.exitNode(this);
        this.exit(tick);
    }

    // Overide these
    enter(tick) { }
    open(tick) { }
    tick(tick) { return BehaviourStatus.ERROR }
    close(tick) { }
    exit(tick) { }
}