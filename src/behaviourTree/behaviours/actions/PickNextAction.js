import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCommands } from '../../../controller/GameCommands';

export class PickNextAction extends BaseNode {
    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        const characterId = tick.blackboard.get('characterId', tick.tree.id, false);

        setTimeout(() => {
            facade.sendNotification(GameCommands.DETERMINE_NEXT_ENEMY_ACTION, characterId);
        }, 500);
    }
}
