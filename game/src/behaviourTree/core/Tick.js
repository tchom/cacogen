export class Tick {
    constructor() {
        this.initialise();
    }

    initialise() {
        this.tree = undefined;
        this.openNodes = [];
        this.nodeCount = 0;
        this.debug = undefined;
        this.target = undefined;
        this.blackboard = undefined;
    }

    enterNode(node) {
        this.nodeCount++;
        this.openNodes.push(node);
    }

    openNode(node) {

    }

    tickNode(node) {

    }

    closeNode(node) {
        this.openNodes.pop();
    }

    exitNode(node) {

    }
}