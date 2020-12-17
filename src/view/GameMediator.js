import { GameCommands } from '../controller/GameCommands';

const { Mediator } = require('@koreez/pure-mvc');

export class GameMediator extends Mediator {
    static get NAME() { return "GameMediator" };

    constructor() {
        console.log("Register mediator - GameMediator");
        const app = pc.Application.getApplication();
        super(GameMediator.NAME, app);
        this.subscribeNotification(GameCommands.APP_INITIALISED);
    }


    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.APP_INITIALISED:

                break;
        }
    }
}
