
import { GameCommands } from '../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class FXCreatorMediator extends Mediator {
    static get NAME() { return "FXCreatorMediator" };

    constructor(viewComponent) {
        super(FXCreatorMediator.NAME);
        this.subscribeNotification([
            GameCommands.CREATE_FX
        ]);

        this.viewComponent = viewComponent;
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {
            case GameCommands.CREATE_FX:
                const scriptComp = this.viewComponent.script['FXCreatorComponent'];
                const fxType = args[0];
                const position = args[1];

                scriptComp.createFX(fxType, position);
                break;
        }
    }

    createFX(fxType, position) {
        return this.viewComponent.script['FXCreatorComponent'].createFX(fxType, position);
    }
}
