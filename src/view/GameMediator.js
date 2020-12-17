import { GameCommand } from '../controller/GameCommand';

const { Mediator } = require('@koreez/pure-mvc');

export class GameMediator extends Mediator {
    static get NAME() { return "GameMediator" };

    constructor() {
        console.log("Register mediator - GameMediator");
        const app = pc.Application.getApplication();
        super(GameMediator.NAME, app);
        this.subscribeNotification(GameCommand.APP_INITIALISED);
    }


    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommand.APP_INITIALISED:

                break;
        }
    }
}
