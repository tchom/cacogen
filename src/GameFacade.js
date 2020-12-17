const { Facade } = require('@koreez/pure-mvc');
import { GameCommands } from './controller/GameCommands';
const { startupCommand } = require('./controller/StartupCommand');
const { changeSceneCommand } = require('./controller/ChangeSceneCommand');

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
    }

}