import { Facade } from '@koreez/pure-mvc';
import { StoryProxy } from '../model/storyProxy/StoryProxy';
import { GameCommands } from './GameCommands';

export function continueDialogueTextCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const storyProxy = facade.retrieveProxy(StoryProxy.NAME);
    const nextStep = storyProxy.continueCurrentNodeStep();
    if (nextStep) {

        if (nextStep.choices) {
            facade.sendNotification(GameCommands.HIDE_DIALOGUE_CONTINUE_BUTTON);
        } else {
            facade.sendNotification(GameCommands.SHOW_DIALOGUE_CONTINUE_BUTTON);
        }

        if (nextStep.notifications) {
            for (const notification of nextStep.notifications) {
                facade.sendNotification(notification.name, ...notification.args);
            }
        }

        facade.sendNotification(GameCommands.DISPLAY_DIALOGUE_STEP, {
            treeId: storyProxy.currentTree,
            step: nextStep
        });
    } else {
        facade.sendNotification(GameCommands.END_DIALOGUE);
    }
}