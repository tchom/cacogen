import { Tick } from "./Tick";

export class BehaviourTree {
    constructor(id) {
        this.initialise(id);
    }

    initialise(id) {
        this.id = id;
        this.root = undefined;
    }

    tick(target, blackboard) {
        /* CREATE A TICK OBJECT */
        const tick = new Tick();
        tick.target = target;
        tick.blackboard = blackboard;
        tick.tree = this;

        /* TICK NODE */
        this.root.execute(tick);

        /* CLOSE NODES FROM LAST TICK, IF NEEDED */
        const lastOpenNodes = blackboard.get('openNodes', this.id) || [];
        const currOpenNodes = tick.openNodes.slice(0);

        // does not close if it is still open in this tick
        let start = 0;
        for (let i = 0; i < Math.min(lastOpenNodes.length, currOpenNodes.length); i++) {
            start = i + 1;
            if (lastOpenNodes[i] !== currOpenNodes[i]) {
                break;
            }
        }

        // close the nodes
        for (let i = lastOpenNodes.length - 1; i >= start; i--) {
            lastOpenNodes[i].close(tick);
        }

        /* POPULATE BLACKBOARD */
        blackboard.set('openNodes', currOpenNodes, this.id);
        blackboard.set('nodeCount', tick.nodeCount, this.id);

    }
}