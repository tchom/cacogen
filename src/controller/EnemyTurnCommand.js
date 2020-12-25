const { Facade } = require('@koreez/pure-mvc');
import { CombatProxy } from '../model/combat/CombatProxy';
import { GameStateProxy } from '../model/gameState/GameStateProxy';
import { gameplayModeTypes } from '../model/gameState/GameStateVO';
import { GameCommands } from './GameCommands';
import { GameMapProxy } from '../model/gameMap/GameMapProxy';

export function enemyTurnCommand(multitonKey, notificationName, ...args) {
    const enemyId = args[0];
    const facade = Facade.getInstance(multitonKey);
    const gameMapProxy = facade.retrieveProxy(GameMapProxy.NAME);
    const node = gameMapProxy.findNearestNode({ x: 0, y: 0, z: 0 });
    if (node) {
        facade.sendNotification(GameCommands.NAVIGATE_TO_NODE + enemyId, node);
    }

    /*setTimeout(() => {
        facade.sendNotification(GameCommands.END_COMBAT_TURN);
    }, 3000);*/

}