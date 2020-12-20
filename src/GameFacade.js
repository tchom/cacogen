const { Facade } = require('@koreez/pure-mvc');
import { GameCommands } from './controller/GameCommands';
import { parseGameMapCommand } from './controller/ParseGameMapCommand';
import { startupCommand } from './controller/StartupCommand';
import { changeSceneCommand } from './controller/ChangeSceneCommand';
import { startCombatCommand } from './controller/StartCombatCommand';
import { nextCombatTurnCommand } from './controller/NextCombatTurnCommand';
import { nextCombatRoundCommand } from './controller/NextCombatRoundCommand';

export class GameFacade extends Facade {
    static getInstance(key) {
        if (!Facade.instanceMap[key]) {
            Facade.instanceMap[key] = new GameFacade(key);
        }
        return Facade.instanceMap[key];
    }

    static get KEY() { return "Cacogen" };
    static get NAME() { return "CacogenFacade" };
    static get STARTUP() { return GameFacade.NAME + "StartUp" };

    startup(game) {
        this.sendNotification(GameFacade.STARTUP, game);
    }

    sendNotification(notificationName, ...args) {
        super.sendNotification(notificationName, ...args);
    }

    initializeController() {
        super.initializeController();
        this.registerCommand(GameFacade.STARTUP, startupCommand);
        this.registerCommand(GameCommands.CHANGE_SCENE, changeSceneCommand);
        this.registerCommand(GameCommands.PARSE_GAMEMAP, parseGameMapCommand);
        this.registerCommand(GameCommands.START_COMBAT, startCombatCommand);
        this.registerCommand(GameCommands.NEXT_COMBAT_TURN, nextCombatTurnCommand);
        this.registerCommand(GameCommands.NEXT_COMBAT_ROUND, nextCombatRoundCommand);
    }

}