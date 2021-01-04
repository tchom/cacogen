import { Facade } from '@koreez/pure-mvc';
import { GameCommands } from './GameCommands';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';

export function resolveDialogueSkillTestCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const test = args[0];
    const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player");

    const playerSkill = characterProxy.getSkillTotal(test.skill)

    // Roll dice
    const die1 = rollDice();
    const die2 = rollDice();

    const totalRoll = die1 + die2;

    const success = playerSkill >= totalRoll;

    facade.sendNotification(GameCommands.DISPLAY_DIALOGUE_SKILL_TEST, test.skill, playerSkill, die1, die2, success);

    if (success) {
        console.log(`Succeeded ${test.skill} with a ${playerSkill} vs ${die1}+${die2}`);
        facade.sendNotification(GameCommands.GO_TO_DIALOGUE_NODE, test.success.goto);

    } else {
        console.log(`Failed ${test.skill} with a ${playerSkill} vs ${die1}+${die2}`);
        facade.sendNotification(GameCommands.GO_TO_DIALOGUE_NODE, test.failure.goto);

    }
}


function rollDice() {
    return Math.round(Math.random() * 6);
}