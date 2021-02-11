const { Facade } = require('@koreez/pure-mvc');
import { GameCommands } from '../controller/GameCommands';
const { GameFacade } = require('../GameFacade');

export const CacogenGame = pc.createScript('CacogenGame');

// initialize code called once per entity
CacogenGame.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    this.facade.sendNotification(GameCommands.APP_INITIALISED);
    this.facade.sendNotification(GameCommands.CHANGE_SCENE, "Port Taringo", "entrance");
};

// update code called every frame
CacogenGame.prototype.update = function (dt) {

};