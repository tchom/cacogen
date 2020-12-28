import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { GameCommands } from './GameCommands';
import { Facade } from '@koreez/pure-mvc';

export function changePlayerActionCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const actionName = args[0];
    const buttonName = args[1];
    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);

    if (gameStateProxy.currentAction === actionName) {
        // Deselect action
        gameStateProxy.currentAction = "none";
    } else {
        gameStateProxy.currentAction = actionName;
    }

    facade.sendNotification(GameCommands.TOGGLE_BUTTON, buttonName);
}