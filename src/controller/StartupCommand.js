import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { WeaponsProxy } from '../model/weapons/WeaponsProxy';
import { StoryProxy } from '../model/storyProxy/StoryProxy';
import { InventoryProxy } from '../model/inventory/InventoryProxy';
import { ItemsProxy } from '../model/items/ItemsProxy';
import { GameCommands } from './GameCommands';
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
        const itemsData = app.assets.get(40814027).resource;
        Facade.getInstance(multitonKey).registerProxy(new ItemsProxy(itemsData));
        Facade.getInstance(multitonKey).registerProxy(new StoryProxy());
        Facade.getInstance(multitonKey).registerProxy(new InventoryProxy());

        // Add default equipment
        Facade.getInstance(multitonKey).sendNotification(GameCommands.ADD_ITEM_TO_INVENTORY, "sword");
        Facade.getInstance(multitonKey).sendNotification(GameCommands.ADD_ITEM_TO_INVENTORY, "fusil");
        Facade.getInstance(multitonKey).sendNotification(GameCommands.ADD_ITEM_TO_INVENTORY, "chainmail");
    }
}