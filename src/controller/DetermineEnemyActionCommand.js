
import { BasicMeleeTree } from '../behaviourTree/trees/BasicMeleeTree';
import { Facade } from '@koreez/pure-mvc';

export function determineEnemyActionCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    console.log("Determine next action");

    const enemyId = args[0];
    const basicMeleeTree = new BasicMeleeTree();
    basicMeleeTree.runCommands(facade, enemyId);
}
