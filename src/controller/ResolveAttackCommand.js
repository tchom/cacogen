import { Facade } from "@koreez/pure-mvc";
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameCommands } from './GameCommands';
import { WeaponsProxy } from '../model/weapons/WeaponsProxy';
import { CombatProxy } from '../model/combat/CombatProxy';
import { WeaponTypes } from '../data/WeaponTypes';

export function resolveAttackCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    const attackerId = args[0];
    const attackerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + attackerId);
    const defenderId = args[1];
    const defenderProxy = facade.retrieveProxy(GameCharacterProxy.NAME + defenderId);

    facade.sendNotification(GameCommands.CHARACTER_LOOK_AT + attackerId, defenderProxy.currentNode);
    facade.sendNotification(GameCommands.CHARACTER_LOOK_AT + defenderId, attackerProxy.currentNode);

    const attackerRoll = rollAttackSkill(attackerProxy.skill);
    const defenderRoll = rollAttackSkill(attackerProxy.skill);

    const weaponsProxy = facade.retrieveProxy(WeaponsProxy.NAME);

    // Reduce actions
    attackerProxy.availableActions -= 1;

    // Determine winner
    if (attackerRoll === defenderRoll) {
        facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `Attack tied(${attackerRoll}/${defenderRoll})`);
    } else {
        if (attackerRoll > defenderRoll) {
            // Attacker wins
            const damageTier = determineDamageTier(attackerRoll, defenderRoll);
            const damage = weaponsProxy.getDamage(attackerProxy.equippedWeapon, damageTier);
            defenderProxy.applyDamage(damage);

            facade.sendNotification(GameCommands.DISPLAY_ATTACK + attackerId);

            if (defenderProxy.isDead) {
                facade.sendNotification(GameCommands.DISPLAY_DEATH + defenderId);
                facade.sendNotification(GameCommands.KILL_GAME_CHARACTER, defenderId);
            } else {
                facade.sendNotification(GameCommands.DISPLAY_HIT + defenderId);
            }

            facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `${attackerId} damages ${defenderId} for ${damage}`);

        } else {
            const weaponCategory = weaponsProxy.getWeaponCategory(defenderProxy.equippedWeapon);
            const hasMeleeWeapon = weaponCategory === "melee";

            // Defender wins
            const damageTier = determineDamageTier(defenderRoll, attackerRoll);
            const weapon = (hasMeleeWeapon) ? defenderProxy.equippedWeapon : WeaponTypes.UNARMED;
            const damage = weaponsProxy.getDamage(weapon, damageTier);
            attackerProxy.applyDamage(damage);
            facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `${defenderId} damages ${attackerId} for ${damage}`);

            facade.sendNotification(GameCommands.DISPLAY_ATTACK + defenderId);

            if (attackerProxy.isDead) {
                facade.sendNotification(GameCommands.DISPLAY_DEATH + attackerId);
                facade.sendNotification(GameCommands.KILL_GAME_CHARACTER, attackerId);

            } else {
                facade.sendNotification(GameCommands.DISPLAY_HIT + attackerId);
            }

        }
    }

    const combatProxy = facade.retrieveProxy(CombatProxy.NAME);
    if (combatProxy && combatProxy.activeParticipant !== "player") {
        setTimeout(() => {
            facade.sendNotification(GameCommands.DETERMINE_NEXT_ENEMY_ACTION, attackerId);

        }, 1500);
    }
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