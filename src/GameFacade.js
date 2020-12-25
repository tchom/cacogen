const { Facade } = require('@koreez/pure-mvc');
import { GameCommands } from './controller/GameCommands';
import { parseGameMapCommand } from './controller/ParseGameMapCommand';
import { startupCommand } from './controller/StartupCommand';
import { changeSceneCommand } from './controller/ChangeSceneCommand';
import { startCombatCommand } from './controller/StartCombatCommand';
import { nextCombatTurnCommand } from './controller/NextCombatTurnCommand';
import { nextCombatRoundCommand } from './controller/NextCombatRoundCommand';
import { endCombatTurnCommand } from './controller/EndCombatTurnCommand';
import { enemyTurnCommand } from './controller/EnemyTurnCommand';
import { selectedNodeCommand } from './controller/SelectedNodeCommand';
import { combatNavigateToNodeCommand } from './controller/CombatNavigateToNodeCommand';
import { showWalkableAreaCommand } from './controller/ShowWalkableAreaCommand';
import { hideWalkableAreaCommand } from './controller/HideWalkableAreaCommand';
import { awaitPlayerCombatInputCommand } from './controller/AwaitPlayerCombatInputCommand';
import { endMovementCommand } from './controller/EndMovementCommand';

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
        this.registerCommand(GameCommands.END_COMBAT_TURN, endCombatTurnCommand);
        this.registerCommand(GameCommands.ENEMY_TURN, enemyTurnCommand);
        this.registerCommand(GameCommands.SELECTED_NODE, selectedNodeCommand);
        this.registerCommand(GameCommands.COMBAT_NAVIGATE_TO_NODE, combatNavigateToNodeCommand);

        this.registerCommand(GameCommands.SHOW_WALKABLE_AREA, showWalkableAreaCommand);
        this.registerCommand(GameCommands.HIDE_WALKABLE_AREA, hideWalkableAreaCommand);
        this.registerCommand(GameCommands.AWAIT_PLAYER_COMBAT_INPUT, awaitPlayerCombatInputCommand);
        this.registerCommand(GameCommands.FINISHED_MOVE, endMovementCommand);
    }

}