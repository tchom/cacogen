export class GameCommands {
    static get CHANGE_SCENE() { return "CHANGE_SCENE" };
    static get CHANGE_SCENE_COMPLETE() { return "CHANGE_SCENE_COMPLETE" };
    static get APP_INITIALISED() { return "APP_INITIALISED" };
    static get PARSE_GAMEMAP() { return "PARSE_GAMEMAP" };
    static get MAP_GRID_CREATED() { return "MAP_GRID_CREATED" };

    static get NAVIGATE_TO_NODE() { return "NAVIGATE_TO_NODE" };
    static get SET_CAMERA_TARGET() { return "SET_CAMERA_TARGET" };
    static get INPUT_DRAG_MOUSE() { return "INPUT_DRAG_MOUSE" };

    static get PC_MOVED_TO_NODE() { return "PC_MOVED_TO_NODE" };
    static get PC_FINISHED_MOVE() { return "PC_FINISHED_MOVE" };
    static get START_COMBAT() { return "START_COMBAT" };
    static get SHOW_TOAST_MESSAGE() { return "SHOW_TOAST_MESSAGE" };

    static get NEXT_COMBAT_TURN() { return "NEXT_COMBAT_TURN" };
    static get NEXT_COMBAT_ROUND() { return "NEXT_COMBAT_ROUND" };

    static get AWAIT_PLAYER_COMBAT_INPUT() { return "AWAIT_PLAYER_COMBAT_INPUT" };


}
