import { Facade } from "@koreez/pure-mvc";
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameCommands } from './GameCommands';
import { WeaponsProxy } from '../model/weapons/WeaponsProxy';
import { CombatProxy } from '../model/combat/CombatProxy';
import { ProjectileCreatorMediator } from '../view/projectiles/ProjectileCreatorMediator';

export function resolveRangedAttackCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    const attackerId = args[0];
    const attackerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + attackerId);
    let defenderId = args[1];
    let defenderProxy = facade.retrieveProxy(GameCharacterProxy.NAME + defenderId);


    facade.sendNotification(GameCommands.CHARACTER_LOOK_AT + attackerId, defenderProxy.currentNode);
    facade.sendNotification(GameCommands.CHARACTER_LOOK_AT + defenderId, attackerProxy.currentNode);

    const attackerRoll = rollAttackSkill(attackerProxy.skill);
    const defenderRoll = rollAttackSkill(attackerProxy.skill);

    const weaponsProxy = facade.retrieveProxy(WeaponsProxy.NAME);

    const projectileCreatorMediator = facade.retrieveMediator(ProjectileCreatorMediator.NAME);
    // TODO: make this more sophisticated
    const projectileOrigin = new pc.Vec3(attackerProxy.currentNode.x,
        attackerProxy.currentNode.y + 1, attackerProxy.currentNode.z);

    const projectileTarget = new pc.Vec3(defenderProxy.currentNode.x,
        defenderProxy.currentNode.y + 1, defenderProxy.currentNode.z);

    // Reduce actions
    attackerProxy.availableActions -= 1;

    facade.sendNotification(GameCommands.DISPLAY_ATTACK + attackerId);
    projectileCreatorMediator.createProjectile('crossbow_bolt', projectileOrigin, projectileTarget)
        .then(() => {
            // Determine outcome
            if (attackerRoll > defenderRoll) {

                // Check if target is in melee and roll for new target
                const combatProxy = facade.retrieveProxy(CombatProxy.NAME);
                if (combatProxy) {

                    const neighbouringNodes = defenderProxy.currentNode.connectedNodes;
                    const possibleTargets = [defenderId];

                    for (const participant of combatProxy.participants) {
                        const participantProxy = facade.retrieveProxy(GameCharacterProxy.NAME + participant);
                        if (!participantProxy.isDead && neighbouringNodes.some(n => n.equals(participantProxy.currentNode))) {
                            possibleTargets.push(participant);
                        }
                    }

                    defenderId = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
                    defenderProxy = facade.retrieveProxy(GameCharacterProxy.NAME + defenderId);
                }


                // Attacker wins
                const damageTier = determineDamageTier(attackerRoll, defenderRoll);
                const damage = weaponsProxy.getDamage(attackerProxy.equippedWeapon, damageTier);
                defenderProxy.applyDamage(damage);


                if (defenderProxy.isDead) {
                    facade.sendNotification(GameCommands.DISPLAY_DEATH + defenderId);
                    facade.sendNotification(GameCommands.KILL_GAME_CHARACTER, defenderId);
                    facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `${attackerId} killed ${defenderId}`);

                } else {
                    facade.sendNotification(GameCommands.DISPLAY_HIT + defenderId);
                    facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `${attackerId} damages ${defenderId} for ${damage}`);
                }


            } else {
                // Defender wins
                facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `${attackerId} missed ${defenderId}`);
            }

            const combatProxy = facade.retrieveProxy(CombatProxy.NAME);
            if (combatProxy && combatProxy.activeParticipant !== "player") {
                setTimeout(() => {
                    facade.sendNotification(GameCommands.DETERMINE_NEXT_ENEMY_ACTION, attackerId);

                }, 500);
            }
        });
}

function determineDamageTier(highDamage, lowDamage) {
    return highDamage - lowDamage;
}

function rollAttackSkill(skill) {
    return skill + rollDice() + rollDice();
}

function rollDice() {
    return Math.round(Math.random() * 6);
}