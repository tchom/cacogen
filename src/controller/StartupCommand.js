import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { WeaponsProxy } from '../model/weapons/WeaponsProxy';
const { Facade } = require('@koreez/pure-mvc');

export function startupCommand(multitonKey, notificationName) {
    // Register app-level mediators/proxies/commands here

    // Create game state proxy
    Facade.getInstance(multitonKey).registerProxy(new GameStateProxy());

    // Load weapons data and create proxy
    const app = pc.Application.getApplication();
    if (app) {
        const weaponsData = app.assets.get(40415631).resource;
        Facade.getInstance(multitonKey).registerProxy(new WeaponsProxy(weaponsData));
    }
}