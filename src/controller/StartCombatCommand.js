const { Facade } = require('@koreez/pure-mvc');
import { GameCommands } from './GameCommands';

export function startCombatCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, "Start Combat");
}