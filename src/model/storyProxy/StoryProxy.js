const { Proxy } = require('@koreez/pure-mvc');
import { GameCommands } from '../../controller/GameCommands';
const { StoryVO } = require('./StoryVO');


export class StoryProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "StoryProxy" };

    constructor() {
        const app = pc.Application.getApplication();
        const storyTrunk = app.assets.get(40529920).resource;
        const storyTrees = storyTrunk.trees;
        const storyTreeMap = new Map();

        for (const treeKey in storyTrees) {
            if (Object.hasOwnProperty.call(storyTrees, treeKey)) {
                const storyTreeAssetId = storyTrees[treeKey];
                const storyTree = app.assets.get(storyTreeAssetId).resource;

                storyTreeMap.set(treeKey, storyTree);
            }
        }

        super(StoryProxy.NAME, storyTreeMap);

        // Properties
        this.currentTree = undefined;
        this.currentNode = undefined;
        this.currentStepIndex = 0;
    }

    getTree(treeId) {
        if (this.vo.has(treeId)) {
            return this.vo.get(treeId);
        } else {
            return undefined;
        }
    }

    getNode(tree, nodeId) {
        const nodes = tree.nodes;
        if (Object.hasOwnProperty.call(nodes, nodeId)) {
            return nodes[nodeId];
        } else {
            return undefined;
        }
    }

    getStep(node, stepIndex) {
        const steps = node.steps;
        if (stepIndex < steps.length) {
            return steps[stepIndex];
        } else {
            return undefined;
        }
    }

    goToNode(nodeId) {
        this.currentNode = nodeId;
        this.currentStepIndex = 0;
    }

    startDialogueTree(treeId) {
        this.currentTree = treeId;
        this.currentNode = "entry";
        this.currentStepIndex = 0;

        const tree = this.getTree(this.currentTree);
        if (!tree) {
            throw Error(`Cannot start dialogue: Tree ${this.currentTree} not found`);
        } else if (!this.getNode(tree, this.currentNode)) {
            throw Error(`Cannot start dialogue: no "entry" node defined on ${treeId}`);
        }

        return tree;
    }

    getCurrentNodeStep() {
        const tree = this.getTree(this.currentTree);
        const currentNode = this.getNode(tree, this.currentNode);
        return this.getStep(currentNode, this.currentStepIndex);
    }


    continueCurrentNodeStep() {
        const tree = this.getTree(this.currentTree);
        const currentNode = this.getNode(tree, this.currentNode)
        // increment stepIndex
        this.currentStepIndex++;

        return this.getStep(currentNode, this.currentStepIndex);
    }

    selectChoice(choiceIndex) {
        const currentNode = this.getCurrentNodeStep();
        const selectedChoice = currentNode.choices[choiceIndex];
        return selectedChoice;
    }


}
