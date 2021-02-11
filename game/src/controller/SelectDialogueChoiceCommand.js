import { Facade } from '@koreez/pure-mvc';
import { StoryProxy } from '../model/storyProxy/StoryProxy';
import { GameCommands } from './GameCommands';

export function selectDialogueChoiceCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const choiceIndex = args[0];
    const storyProxy = facade.retrieveProxy(StoryProxy.NAME);
    const selectedChoice = storyProxy.selectChoice(choiceIndex);

    facade.sendNotification(GameCommands.CLEAR_DIALOGUE_CHOICES);

    const response = {
        title: "YOU",
        text: selectedChoice.text,
        titleColour: '#DB831C'
    }

    facade.sendNotification(GameCommands.DISPLAY_DIALOGUE_STEP, {
        treeId: storyProxy.currentTree,
        step: response
    });

    if (selectedChoice.test) {
        facade.sendNotification(GameCommands.RESOLVE_DIALOGUE_SKILL_TEST, selectedChoice.test);

    } else {
        if (selectedChoice.goto) {
            facade.sendNotification(GameCommands.GO_TO_DIALOGUE_NODE, selectedChoice.goto);
        }
    }
}