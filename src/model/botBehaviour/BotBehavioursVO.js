import { BotBehaviourTypes } from "../../behaviourTree/BotBehaviourTypes";
import { BasicMeleeTree } from "../../behaviourTree/trees/BasicMeleeTree";
import { BasicRangedTree } from '../../behaviourTree/trees/BasicRangedTree';

export class BotBehavioursVO {
    constructor(participants, teams) {
        this.behaviourTrees = new Map();

        this.behaviourTrees.set(BotBehaviourTypes.BASIC_MELEE, new BasicMeleeTree());
        this.behaviourTrees.set(BotBehaviourTypes.BASIC_RANGED, new BasicRangedTree());
    }

    getTree(type) {
        return this.behaviourTrees.get(type);
    }
}