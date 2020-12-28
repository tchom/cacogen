
import { BasicMeleeTree } from '../behaviourTree/trees/BasicMeleeTree';
import { Facade } from '@koreez/pure-mvc';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { BotBehaviourTypes } from '../behaviourTree/BotBehaviourTypes';

export function determineEnemyActionCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    const enemyId = args[0];
    const enemyProxy = facade.retrieveProxy(GameCharacterProxy.NAME + enemyId);

    switch (enemyProxy.botBehaviour) {
        case BotBehaviourTypes.BASIC_MELEE:
            const basicMeleeTree = new BasicMeleeTree();
            basicMeleeTree.runCommands(facade, enemyId);
            break;
        case BotBehaviourTypes.BASIC_RANGED:

            break;
        default:
            break;
    }
}
