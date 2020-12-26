import { Facade } from "@koreez/pure-mvc";
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameCommands } from './GameCommands';
import { WeaponsProxy } from '../model/weapons/WeaponsProxy';

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

    // Determine winner
    if (attackerRoll === defenderRoll) {
        facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `Attack tied(${attackerRoll}/${defenderRoll})`);
    } else {
        if (attackerRoll > defenderRoll) {
            // Attacker wins
            const damageTier = determineDamageTier(attackerRoll, defenderRoll);
            const damage = weaponsProxy.getDamage("sword", damageTier);
            defenderProxy.applyDamage(damage);

            facade.sendNotification(GameCommands.DISPLAY_ATTACK + attackerId);

            if (defenderProxy.isDead) {
                facade.sendNotification(GameCommands.DISPLAY_DEATH + defenderId);
            } else {
                facade.sendNotification(GameCommands.DISPLAY_HIT + defenderId);
            }

            facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `${attackerId} damages ${defenderId} for ${damage}`);

        } else {
            // Defender wins
            const damageTier = determineDamageTier(defenderRoll, attackerRoll);
            const damage = weaponsProxy.getDamage("sword", damageTier);
            attackerProxy.applyDamage(damage);
            facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `${defenderId} damages ${attackerId} for ${damage}`);

            facade.sendNotification(GameCommands.DISPLAY_ATTACK + defenderId);

            if (attackerProxy.isDead) {
                facade.sendNotification(GameCommands.DISPLAY_DEATH + attackerId);
            } else {
                facade.sendNotification(GameCommands.DISPLAY_HIT + attackerId);
            }

        }
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