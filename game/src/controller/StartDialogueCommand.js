const { Facade } = require('@koreez/pure-mvc');
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCommands } from './GameCommands';
import { StoryProxy } from '../model/storyProxy/StoryProxy';

export function startDialogueCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const gamestateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    const dialogueTree = args[0];
    const startingNode = args[1] ?? undefined;

    const storyProxy = facade.retrieveProxy(StoryProxy.NAME);

    const storyTree = storyProxy.startDialogueTree(dialogueTree, startingNode);

    gamestateProxy.updateGameStateType(gameplayModeTypes.DIALOGUE);


    facade.sendNotification(GameCommands.SHOW_DIALOGUE_PANEL);

    const openingStep = storyProxy.getCurrentNodeStep();
    facade.sendNotification(GameCommands.DISPLAY_DIALOGUE_STEP, {
        treeId: dialogueTree,
        step: openingStep
    });
}