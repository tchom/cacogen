import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { WeaponsProxy } from '../model/weapons/WeaponsProxy';
import { StoryProxy } from '../model/storyProxy/StoryProxy';
import { ItemsProxy } from '../model/items/ItemsProxy';
import { GameCommands } from './GameCommands';
import { BotBehaviourProxy } from '../model/botBehaviour/BotBehaviourProxy';
import { SpellsProxy } from '../model/spells/SpellsProxy';
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
        const spellsData = app.assets.get(41147204).resource;
        Facade.getInstance(multitonKey).registerProxy(new SpellsProxy(spellsData));
        Facade.getInstance(multitonKey).registerProxy(new StoryProxy());
        Facade.getInstance(multitonKey).registerProxy(new BotBehaviourProxy());
    }
}