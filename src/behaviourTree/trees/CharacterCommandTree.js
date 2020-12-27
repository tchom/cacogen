import { Blackboard } from '../core/Blackboard';
import { BehaviourTree } from '../core/BehaviourTree';

export class CharacterCommandTree {
    constructor(id) {
        this.id = 'basicMeleeTree';
        this.blackboard = new Blackboard();
        this.tree = new BehaviourTree(id);

        this.initialise();
    }

    initialise() {
        // Override to set tree
    }

    runCommands(facade, characterId) {
        this.blackboard.set("facade", facade, false, false);
        this.blackboard.set("characterId", characterId, this.tree.id, false);

        this.tree.tick(this, this.blackboard);
    }

}