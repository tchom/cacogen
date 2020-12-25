export class GameCommands {
    static get CHANGE_SCENE() { return "CHANGE_SCENE" };
    static get CHANGE_SCENE_COMPLETE() { return "CHANGE_SCENE_COMPLETE" };
    static get APP_INITIALISED() { return "APP_INITIALISED" };
    static get PARSE_GAMEMAP() { return "PARSE_GAMEMAP" };
    static get MAP_GRID_CREATED() { return "MAP_GRID_CREATED" };

    static get NAVIGATE_TO_NODE() { return "NAVIGATE_TO_NODE" };
    static get COMBAT_NAVIGATE_TO_NODE() { return "COMBAT_NAVIGATE_TO_NODE" };
    static get SET_CAMERA_TARGET() { return "SET_CAMERA_TARGET" };
    static get INPUT_DRAG_MOUSE() { return "INPUT_DRAG_MOUSE" };

    static get MOVED_TO_NODE() { return "MOVED_TO_NODE" };
    static get FINISHED_MOVE() { return "FINISHED_MOVE" };
    static get START_COMBAT() { return "START_COMBAT" };
    static get SHOW_TOAST_MESSAGE() { return "SHOW_TOAST_MESSAGE" };

    static get NEXT_COMBAT_TURN() { return "NEXT_COMBAT_TURN" };
    static get NEXT_COMBAT_ROUND() { return "NEXT_COMBAT_ROUND" };

    static get END_COMBAT_TURN() { return "END_COMBAT_TURN" };
    static get ENEMY_TURN() { return "ENEMY_TURN" };
    static get SELECTED_NODE() { return "SELECTED_NODE" };

    static get NAVIGATE_ALONG_PATH() { return "NAVIGATE_ALONG_PATH" };

    static get SHOW_WALKABLE_AREA() { return "SHOW_WALKABLE_AREA" };
    static get HIDE_WALKABLE_AREA() { return "HIDE_WALKABLE_AREA" };


    static get END_MOVEMENT() { return "END_MOVEMENT" };
    static get AWAIT_PLAYER_COMBAT_INPUT() { return "AWAIT_PLAYER_COMBAT_INPUT" };
    static get SET_CHARACTER_TO_NODE() { return "SET_CHARACTER_TO_NODE" };

    static get SELECT_GAME_CHARACTER() { return "SELECT_GAME_CHARACTER" };

    static get SET_PLAYER_ACTION() { return "SET_PLAYER_ACTION" };
    static get DISPLAY_PLAYER_ACTION() { return "DISPLAY_PLAYER_ACTION" };

    static get RESOLVE_ATTACK() { return "RESOLVE_ATTACK" };



}
