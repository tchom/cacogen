
import { GameCommands } from '../../controller/GameCommands';
const { Mediator } = require('@koreez/pure-mvc');

export class ProjectileCreatorMediator extends Mediator {
    static get NAME() { return "ProjectileCreatorMediator" };

    constructor(viewComponent) {
        super(ProjectileCreatorMediator.NAME);
        this.subscribeNotification([

        ]);

        this.viewComponent = viewComponent;
    }

    onRegister(notificationSubscriptionChange) {
        super.onRegister(notificationSubscriptionChange);
    }

    handleNotification(notificationName, ...args) {
        switch (notificationName) {

        }
    }

    createProjectile(type, originPoint, targetPoint) {
        return this.viewComponent.script['ProjectileCreatorComponent'].createProjectile(type, originPoint, targetPoint);
    }
}
