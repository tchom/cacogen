import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCommands } from '../../../controller/GameCommands';

export class EndCombatTurn extends BaseNode {
    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        facade.sendNotification(GameCommands.END_COMBAT_TURN);

        return BehaviourStatus.SUCCESS;
    }
}