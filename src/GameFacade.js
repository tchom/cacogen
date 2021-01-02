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
import { selectedGameCharacterCommand } from './controller/SelectedGameCharacterCommand';
import { changePlayerActionCommand } from './controller/ChangePlayerActionCommand';
import { resolveAttackCommand } from './controller/ResolveAttackCommand';
import { moveAlongPathAndAttackCommand } from './controller/MoveAlongPathAndAttackCommand';
import { killGameCharacterCommand } from './controller/KillGameCharacterCommand';
import { endCombatCommand } from './controller/EndCombatCommand';
import { determineEnemyActionCommand } from './controller/DetermineEnemyActionCommand';
import { resolveRangedAttackCommand } from './controller/ResolveRangedAttackCommand';
import { equipWeaponCommand } from './controller/EquipWeaponCommand';
import { navigateThroughPortalCommand } from './controller/NavigateThroughPortalCommand';
import { addPlayerCharacterToMapCommand } from './controller/AddPlayerCharacterToMapCommand';
import { navigateToCharacterAndTalkCommand } from './controller/NavigateToCharacterAndTalk';
import { startDialogueCommand } from './controller/StartDialogueCommand';
import { continueDialogueTextCommand } from './controller/ContinueDialogueTextCommand';
import { selectDialogueChoiceCommand } from './controller/SelectDialogueChoiceCommand';
import { goToDialogueNodeCommand } from './controller/GoToDialogueNodeCommand';
import { endDialogueCommand } from './controller/EndDialogueCommand';
import { navigateToCharacterAndAttackCommand } from './controller/NavigateToCharacterAndAttackCommand';
import { changeGameplayActionCommand } from './controller/ChangeGameplayActionCommand';

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
        this.registerCommand(GameCommands.DETERMINE_NEXT_ENEMY_ACTION, determineEnemyActionCommand);

        this.registerCommand(GameCommands.SHOW_WALKABLE_AREA, showWalkableAreaCommand);
        this.registerCommand(GameCommands.HIDE_WALKABLE_AREA, hideWalkableAreaCommand);
        this.registerCommand(GameCommands.AWAIT_PLAYER_COMBAT_INPUT, awaitPlayerCombatInputCommand);
        this.registerCommand(GameCommands.FINISHED_MOVE, endMovementCommand);
        this.registerCommand(GameCommands.SELECT_GAME_CHARACTER, selectedGameCharacterCommand);

        this.registerCommand(GameCommands.RESOLVE_ATTACK, resolveAttackCommand);
        this.registerCommand(GameCommands.RESOLVE_RANGED_ATTACK, resolveRangedAttackCommand);
        this.registerCommand(GameCommands.MOVE_ALONG_PATH_AND_ATTACK, moveAlongPathAndAttackCommand);
        this.registerCommand(GameCommands.NAVIGATE_TO_CHARACTER_AND_ATTACK, navigateToCharacterAndAttackCommand);

        this.registerCommand(GameCommands.KILL_GAME_CHARACTER, killGameCharacterCommand);
        this.registerCommand(GameCommands.END_COMBAT, endCombatCommand);
        this.registerCommand(GameCommands.EQUIP_WEAPON, equipWeaponCommand);
        this.registerCommand(GameCommands.NAVIGATE_THROUGH_PORTAL, navigateThroughPortalCommand);
        this.registerCommand(GameCommands.ADD_PLAYER_CHARACTER_TO_MAP, addPlayerCharacterToMapCommand);
        this.registerCommand(GameCommands.NAVIGATE_TO_CHARACTER_AND_TALK, navigateToCharacterAndTalkCommand)
        this.registerCommand(GameCommands.START_DIALOGUE, startDialogueCommand);
        this.registerCommand(GameCommands.CONTINUE_DIALOGUE_NODE, continueDialogueTextCommand);
        this.registerCommand(GameCommands.SELECT_DIALOGUE_CHOICE, selectDialogueChoiceCommand);
        this.registerCommand(GameCommands.GO_TO_DIALOGUE_NODE, goToDialogueNodeCommand);
        this.registerCommand(GameCommands.END_DIALOGUE, endDialogueCommand);
        this.registerCommand(GameCommands.GAMEPLAY_ACTION_CHANGED, changeGameplayActionCommand);
    }

}