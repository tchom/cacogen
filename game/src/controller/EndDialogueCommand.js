const { Facade } = require('@koreez/pure-mvc');
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCommands } from './GameCommands';

export function endDialogueCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const gamestateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    gamestateProxy.updateGameStateType(gameplayModeTypes.EXPLORATION);


    facade.sendNotification(GameCommands.HIDE_DIALOGUE_PANEL);

}
