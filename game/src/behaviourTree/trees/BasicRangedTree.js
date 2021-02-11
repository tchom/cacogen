import { MasterNode } from '../core/MasterNode';
import { CharacterCommandTree } from './CharacterCommandTree';
import { Priority } from '../core/Priority';
import { SetPlayerAsTarget } from '../behaviours/actions/SetPlayerAsTarget';
import { EndCombatTurn } from '../behaviours/actions/EndCombatTurn';
import { MemSequence } from '../core/MemSequence';
import { Inverter } from '../core/decorators/Inverter';
import { IsTargetDead } from '../behaviours/conditions/IsTargetDead';
import { IsDead } from '../behaviours/conditions/IsDead';
import { HasMovementRemaining } from '../behaviours/conditions/HasMovementRemaining';
import { HasActionsRemaining } from '../behaviours/conditions/HasActionsRemaining';
import { RangeAttackTarget } from '../behaviours/actions/RangeAttackTarget';
import { MaintainDistanceFromTarget } from '../behaviours/actions/MaintainDistanceFromTarget';
import { PickNextAction } from '../behaviours/actions/PickNextAction';
import { CanSeeTarget } from '../behaviours/conditions/CanSeeTarget';
import { MoveTowardsTargetUntilVisible } from '../behaviours/actions/MoveTowardsTargetUntilVisible';

export class BasicRangedTree extends CharacterCommandTree {

    constructor() {
        super('basicRangedTree');
    }

    initialise() {
        this.tree.root = new MasterNode([
            new Priority(
                [
                    new MemSequence([
                        new SetPlayerAsTarget(),
                        new Inverter([new IsDead()]),
                        new Inverter([new IsTargetDead()]),
                        new Priority([
                            new MemSequence([
                                new HasMovementRemaining(),
                                new Inverter([new CanSeeTarget()]),
                                new MoveTowardsTargetUntilVisible()
                            ]),
                            new MemSequence([
                                new HasMovementRemaining(),
                                new Priority([
                                    new MaintainDistanceFromTarget(9, 12),
                                    new PickNextAction()
                                ])
                            ]),
                            new MemSequence([
                                new HasActionsRemaining(),
                                new CanSeeTarget(),
                                new RangeAttackTarget()
                            ])
                        ])
                    ]),
                    new EndCombatTurn()
                ],
            )
        ]);
    }
}