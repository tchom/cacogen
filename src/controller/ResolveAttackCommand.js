import { Facade } from "@koreez/pure-mvc";
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';
import { GameCommands } from './GameCommands';

export function resolveAttackCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    const attackerId = args[0];
    const attackerProxy = facade.retrieveProxy(GameCharacterProxy.NAME + attackerId);
    const defenderId = args[1];
    const defenderProxy = facade.retrieveProxy(GameCharacterProxy.NAME + defenderId);

    facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `${attackerId} attacks ${defenderId}`);
}