import { MasterNode } from '../core/MasterNode';
import { CharacterCommandTree } from './CharacterCommandTree';
import { Priority } from '../core/Priority';
import { SetPlayerAsTarget } from '../behaviours/actions/SetPlayerAsTarget';
import { MeleeAttackTarget } from '../behaviours/actions/MeleeAttackTarget';
import { EndCombatTurn } from '../behaviours/actions/EndCombatTurn';
import { HasMovementRemaining } from '../behaviours/conditions/HasMovementRemaining';
import { IsNextToPlayer } from '../behaviours/conditions/IsNextToPlayer';
import { MemSequence } from '../core/MemSequence';
import { Inverter } from '../core/decorators/Inverter';
import { IsTargetDead } from '../behaviours/conditions/IsTargetDead';
import { MoveTowardsTarget } from '../behaviours/actions/MoveTowardsTarget';
import { IsDead } from '../behaviours/conditions/IsDead';
import { HasActionsRemaining } from '../behaviours/conditions/HasActionsRemaining';

export class BasicMeleeTree extends CharacterCommandTree {

    constructor() {
        super('basicMeleeTree');
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
                                new IsNextToPlayer(),
                                new HasActionsRemaining(),
                                new SetPlayerAsTarget(),
                                new MeleeAttackTarget()
                            ]),
                            new MemSequence([
                                new HasMovementRemaining(),
                                new SetPlayerAsTarget(),
                                new MoveTowardsTarget()
                            ])
                        ]),
                    ]),

                    new EndCombatTurn()
                ],
            )
        ]);
    }
}