import { Facade } from '@koreez/pure-mvc';
import { GameCommands } from '../GameCommands';
import { GameStateProxy } from '../../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../../model/gameState/GameStateVO';
import { GameCharacterProxy } from '../../model/gameCharacter/GameCharacterProxy';
import { SpellsProxy } from '../../model/spells/SpellsProxy';
import { WeaponsProxy } from '../../model/weapons/WeaponsProxy';


export function spellZapCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const playerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");
    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    const spellsProxy = facade.retrieveProxy(SpellsProxy.NAME);
    const zapData = spellsProxy.retieveSpellDefinition("zap");
    const pickedEntity = args[0];
    const hitPosition = args[1];


    if (pickedEntity.tags.has('gameCharacter')) {
        const gameCharacterComp = pickedEntity.script['GameCharacterComponent'];
        const targetId = gameCharacterComp.characterId;

        // facade.sendNotification(GameCommands.KILL_GAME_CHARACTER, targetId);
        resolveZapAttack(facade, "player", targetId);

        if (gameStateProxy.currentMode === gameplayModeTypes.EXPLORATION) {
            facade.sendNotification(GameCommands.START_COMBAT, targetId);
        } else if (gameStateProxy.currentMode === gameplayModeTypes.COMBAT) {
            playerProxy.availableActions -= 1;
        }

        playerProxy.applyDamage(zapData.stamina);
    } else {

    }
}

function resolveZapAttack(facade, attackerId, defenderId) {
    const weaponsProxy = facade.retrieveProxy(WeaponsProxy.NAME);

    // Scores for comparisson
    let attackerScore = 0;
    let defenderScore = 0;

    const attackerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + attackerId);
    let defenderProxy = facade.retrieveProxy(GameCharacterProxy.NAME + defenderId);

    facade.sendNotification(GameCommands.CHARACTER_LOOK_AT + attackerId, defenderProxy.currentNode);
    facade.sendNotification(GameCommands.CHARACTER_LOOK_AT + defenderId, attackerProxy.currentNode);

    const attackerSpellSkill = `spellZap`;
    const attackerSkillTotal = attackerProxy.getSkillTotal(attackerSpellSkill);

    attackerScore += rollAttackSkill(attackerSkillTotal);
    defenderScore += rollAttackSkill(defenderProxy.skill);


    // Determine outcome
    if (attackerScore > defenderScore) {

        // Attacker wins
        const damageTier = determineDamageTier(attackerScore, defenderScore);
        const damage = weaponsProxy.getDamage('zap', damageTier);


        defenderProxy.applyDamage(damage);

        if (defenderProxy.isDead) {
            facade.sendNotification(GameCommands.KILL_GAME_CHARACTER, defenderId);
            facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `${attackerId} zaps ${defenderId} to death`);

        } else {
            facade.sendNotification(GameCommands.DISPLAY_HIT + defenderId);
            facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `${attackerId} zaps ${defenderId} for ${damage}`);
        }


    } else {
        // Defender wins
        facade.sendNotification(GameCommands.DISPLAY_FLOATING_STATUS, "dodge", defenderProxy);
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