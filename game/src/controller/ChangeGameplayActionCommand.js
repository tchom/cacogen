const { Facade } = require('@koreez/pure-mvc');
import { GameStateProxy } from '../model/gameState/GameStateProxy';

export function changeGameplayActionCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const newAction = args[0];
    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    gameStateProxy.currentAction = newAction;

}