import { Facade } from '@koreez/pure-mvc';
import { StoryProxy } from '../model/storyProxy/StoryProxy';
import { GameCommands } from './GameCommands';

export function continueDialogueTextCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const storyProxy = facade.retrieveProxy(StoryProxy.NAME);
    const nextStep = storyProxy.continueCurrentNodeStep();
    if (nextStep) {
        facade.sendNotification(GameCommands.DISPLAY_DIALOGUE_STEP, {
            treeId: storyProxy.currentTree,
            step: nextStep
        });
    } else {
        facade.sendNotification(GameCommands.END_DIALOGUE);
    }
}