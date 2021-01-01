import { Facade } from '@koreez/pure-mvc';
import { StoryProxy } from '../model/storyProxy/StoryProxy';
import { GameCommands } from './GameCommands';

export function selectDialogueChoiceCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const choiceIndex = args[0];
    const storyProxy = facade.retrieveProxy(StoryProxy.NAME);
    const selectedChoice = storyProxy.selectChoice(choiceIndex);

    facade.sendNotification(GameCommands.CLEAR_DIALOGUE_CHOICES);
    facade.sendNotification(GameCommands.DISPLAY_DIALOGUE_STEP, {
        treeId: storyProxy.currentTree,
        step: selectedChoice
    });

    console.log(selectedChoice);

    if (selectedChoice.goto) {
        facade.sendNotification(GameCommands.GO_TO_DIALOGUE_NODE, selectedChoice.goto);
    }

}