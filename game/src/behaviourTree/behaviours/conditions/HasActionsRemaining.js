import { BaseNode } from '../../core/BaseNode';
import { BehaviourStatus } from '../../core/BehaviourStatus';
import { GameCommands } from '../../../controller/GameCommands';
import { GameCharacterProxy } from '../../../model/gameCharacter/GameCharacterProxy';

export class HasActionsRemaining extends BaseNode {
    tick(tick) {
        const facade = tick.blackboard.get('facade', false, false);
        const characterId = tick.blackboard.get('characterId', tick.tree.id, false);
        const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);

        if (characterProxy.availableActions > 0) {
            return BehaviourStatus.SUCCESS;

        } else {
            return BehaviourStatus.FAILURE;

        }
    }
}
