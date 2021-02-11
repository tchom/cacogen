export class Blackboard {
    constructor() {
        this.initialise();
    }

    initialise() {
        this.baseMemory = {}; // used to store global information
        this.treeMemory = {}; // used to store tree and node information
    }

    getTreeMemory(treeScope) {
        if (!this.treeMemory[treeScope]) {
            this.treeMemory[treeScope] = {
                nodeMemory: {},
                openNodes: []
            };
        }
        return this.treeMemory[treeScope];
    }

    getNodeMemory(treeMemory, nodeScope) {
        const memory = treeMemory['nodeMemory'];
        if (!memory.hasOwnProperty(nodeScope)) {
            memory[nodeScope] = {};
        }

        return memory[nodeScope];
    }

    getMemory(treeScope, nodeScope) {
        var memory = this.baseMemory;

        if (treeScope) {
            memory = this.getTreeMemory(treeScope);

            if (nodeScope) {
                memory = this.getNodeMemory(memory, nodeScope);
            }
        }

        return memory;
    };

    set(key, value, treeScope, nodeScope) {
        const memory = this.getMemory(treeScope, nodeScope);
        memory[key] = value;
    };

    get(key, treeScope, nodeScope) {
        const memory = this.getMemory(treeScope, nodeScope);
        return memory[key];
    }
}