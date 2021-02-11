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
        this.currentConditions = [];
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
        const validStep = this.getValidStep(currentNode, this.currentStepIndex);
        if (validStep && validStep.once) {
            const onceCondition = this.getConditionStringForStep(this.currentTree, this.currentNode, this.currentStepIndex);
            this.addCondition(onceCondition);
        }
        return validStep;
    }


    continueCurrentNodeStep() {
        const tree = this.getTree(this.currentTree);
        const currentNode = this.getNode(tree, this.currentNode)
        // increment stepIndex
        this.currentStepIndex++;

        const validStep = this.getValidStep(currentNode, this.currentStepIndex);
        if (validStep && validStep.once) {
            const onceCondition = this.getConditionStringForStep(this.currentTree, this.currentNode, this.currentStepIndex);
            this.addCondition(onceCondition);
        }
        return validStep;
    }

    getValidStep(node, stepIndex) {
        let nextValidStep = this.getStep(node, stepIndex);


        if (nextValidStep) {
            let testConditions = [];
            if (nextValidStep.conditions) {
                testConditions = testConditions.concat(nextValidStep.conditions);
            }

            if (nextValidStep.once) {
                const onceCondition = this.getInvertedConditionStringForStep(this.currentTree, this.currentNode, stepIndex);
                testConditions = testConditions.concat(onceCondition);
                console.log('Test valid step');
                console.log(testConditions);
            }

            if (this.testConditions(testConditions)) {
                return nextValidStep;
            } else {
                this.currentStepIndex = stepIndex + 1;
                return this.getValidStep(node, this.currentStepIndex);
            }

        } else {
            return nextValidStep;
        }
    }

    getConditionStringForStep(treeId, nodeId, stepIndex) {
        return `${treeId}${nodeId}${stepIndex}`;
    }

    getInvertedConditionStringForStep(treeId, nodeId, stepIndex) {
        return `!${treeId}${nodeId}${stepIndex}`;
    }

    selectChoice(choiceIndex) {
        const currentNode = this.getCurrentNodeStep();
        const selectedChoice = currentNode.choices[choiceIndex];
        return selectedChoice;
    }

    addCondition(condition) {
        if (this.currentConditions.indexOf(condition) === -1) {
            this.currentConditions.push(condition);
        }
    }

    removeCondition(condition) {
        const index = this.currentConditions.indexOf(condition);
        if (index > -1) {
            this.currentConditions.splice(index, 1);
        }
    }

    testConditions(conditions) {
        let success = true;

        for (const condition of conditions) {
            // check for operators
            const orDelimitered = "||";
            const orConditions = condition.split(orDelimitered);

            if (orConditions.length > 1) {
                // Only one needs to be true
                let orSuccess = false;
                for (const optionalCondition of orConditions) {
                    if (this.checkCondition(optionalCondition)) {
                        orSuccess = true;
                    }
                }
                if (success) {
                    success = orSuccess;
                }
            } else {
                if (success) {
                    success = this.checkCondition(condition);
                }
            }
        }

        return success;
    }

    checkCondition(condition) {
        let success = true;

        // determine if positive of negative
        if (condition.startsWith("!")) {
            const strippedString = condition.slice(1, condition.length);

            if (this.currentConditions.indexOf(strippedString) > -1) {
                success = false;
            }
        } else if (condition.startsWith("+")) {
            const strippedString = condition.slice(1, condition.length);
            this.addCondition(strippedString);
            success = true;
        } else if (condition.startsWith("-")) {
            const strippedString = condition.slice(1, condition.length);
            this.removeCondition(strippedString);
            success = true;
        } else {
            if (this.currentConditions.indexOf(condition) === -1) {
                success = false;
            }
        }

        return success;
    }
}
