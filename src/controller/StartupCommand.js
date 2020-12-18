import { GameStateProxy } from '../model/gameState/GameStateProxy';
const { Facade } = require('@koreez/pure-mvc');

export function startupCommand(multitonKey, notificationName) {
    // Register app-level mediators/proxies/commands here

    // Create game state proxy
    Facade.getInstance(multitonKey).registerProxy(new GameStateProxy());


}