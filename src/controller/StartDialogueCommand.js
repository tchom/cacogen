const { Facade } = require('@koreez/pure-mvc');
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCommands } from './GameCommands';

export function startDialogueCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const gamestateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    const targetCharacterId = args[0];

    const playerCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + "player")
    const targetCharacterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + targetCharacterId);

    gamestateProxy.updateGameStateType(gameplayModeTypes.DIALOGUE);

    facade.sendNotification(GameCommands.CHARACTER_LOOK_AT + "player", targetCharacterProxy.currentNode);
    facade.sendNotification(GameCommands.CHARACTER_LOOK_AT + targetCharacterId, playerCharacterProxy.currentNode);
    facade.sendNotification(GameCommands.SHOW_DIALOGUE_PANEL);
}