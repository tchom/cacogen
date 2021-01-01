import { Facade } from '@koreez/pure-mvc';
import { StoryProxy } from '../model/storyProxy/StoryProxy';
import { GameCommands } from './GameCommands';

export function goToDialogueNodeCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const storyProxy = facade.retrieveProxy(StoryProxy.NAME);
    const newNode = args[0];
    storyProxy.goToNode(newNode);
    const currentStep = storyProxy.getCurrentNodeStep();

    if (currentStep) {
        facade.sendNotification(GameCommands.SHOW_DIALOGUE_CONTINUE_BUTTON);
        facade.sendNotification(GameCommands.DISPLAY_DIALOGUE_STEP, {
            treeId: storyProxy.currentTree,
            step: currentStep
        });
    } else {
        facade.sendNotification(GameCommands.END_DIALOGUE);
    }
}