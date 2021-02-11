
import { BasicMeleeTree } from '../behaviourTree/trees/BasicMeleeTree';
import { Facade } from '@koreez/pure-mvc';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { BotBehaviourTypes } from '../behaviourTree/BotBehaviourTypes';
import { BasicRangedTree } from '../behaviourTree/trees/BasicRangedTree';
import { BotBehaviourProxy } from '../model/botBehaviour/BotBehaviourProxy';

export function determineEnemyActionCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    const enemyId = args[0];
    const enemyProxy = facade.retrieveProxy(GameCharacterProxy.NAME + enemyId);
    const botBehaviourProxy = facade.retrieveProxy(BotBehaviourProxy.NAME);
    const tree = botBehaviourProxy.getTree(enemyProxy.botBehaviour);
    if (tree) {
        tree.runCommands(facade, enemyId);
    }
}
