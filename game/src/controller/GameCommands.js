export class GameCommands {
    static get CHANGE_SCENE() { return "CHANGE_SCENE" };
    static get CHANGE_SCENE_COMPLETE() { return "CHANGE_SCENE_COMPLETE" };
    static get APP_INITIALISED() { return "APP_INITIALISED" };
    static get PARSE_GAMEMAP() { return "PARSE_GAMEMAP" };
    static get MAP_GRID_CREATED() { return "MAP_GRID_CREATED" };

    static get NAVIGATE_TO_NODE() { return "NAVIGATE_TO_NODE" };
    static get NAVIGATE_TO_WAYPOINT() { return "NAVIGATE_TO_WAYPOINT" };
    static get NAVIGATE_TO_WORLD_OBJECT() { return "NAVIGATE_TO_WORLD_OBJECT" };
    static get NAVIGATE_THROUGH_PORTAL() { return "NAVIGATE_THROUGH_PORTAL" };
    static get COMBAT_NAVIGATE_TO_NODE() { return "COMBAT_NAVIGATE_TO_NODE" };
    static get SET_CAMERA_TARGET() { return "SET_CAMERA_TARGET" };
    static get INPUT_DRAG_MOUSE() { return "INPUT_DRAG_MOUSE" };

    static get MOVED_TO_NODE() { return "MOVED_TO_NODE" };
    static get FINISHED_MOVE() { return "FINISHED_MOVE" };
    static get START_COMBAT() { return "START_COMBAT" };
    static get SHOW_TOAST_MESSAGE() { return "SHOW_TOAST_MESSAGE" };

    static get NEXT_COMBAT_TURN() { return "NEXT_COMBAT_TURN" };
    static get NEXT_COMBAT_ROUND() { return "NEXT_COMBAT_ROUND" };

    static get END_COMBAT() { return "END_COMBAT" };
    static get END_COMBAT_TURN() { return "END_COMBAT_TURN" };
    static get ENEMY_TURN() { return "ENEMY_TURN" };
    static get SELECTED_NODE() { return "SELECTED_NODE" };
    static get DETERMINE_NEXT_ENEMY_ACTION() { return "DETERMINE_NEXT_ENEMY_ACTION" };

    static get NAVIGATE_ALONG_PATH() { return "NAVIGATE_ALONG_PATH" };

    static get SHOW_WALKABLE_AREA() { return "SHOW_WALKABLE_AREA" };
    static get HIDE_WALKABLE_AREA() { return "HIDE_WALKABLE_AREA" };


    static get END_MOVEMENT() { return "END_MOVEMENT" };
    static get AWAIT_PLAYER_COMBAT_INPUT() { return "AWAIT_PLAYER_COMBAT_INPUT" };
    static get SET_CHARACTER_TO_NODE() { return "SET_CHARACTER_TO_NODE" };

    static get SELECT_GAME_CHARACTER() { return "SELECT_GAME_CHARACTER" };

    static get TOGGLE_BUTTON() { return "TOGGLE_BUTTON" };

    static get USE_PLAYER_ACTION() { return "USE_PLAYER_ACTION" };

    static get RESOLVE_ATTACK() { return "RESOLVE_ATTACK" };
    static get RESOLVE_RANGED_ATTACK() { return "RESOLVE_RANGED_ATTACK" };
    static get MOVE_ALONG_PATH_AND_ATTACK() { return "MOVE_ALONG_PATH_AND_ATTACK" };

    static get UPDATE_STAMINA() { return "UPDATE_STAMINA" };
    static get DISPLAY_DEATH() { return "DISPLAY_DEATH" };
    static get DISPLAY_ATTACK() { return "DISPLAY_ATTACK" };
    static get DISPLAY_HIT() { return "DISPLAY_HIT" };
    static get KILL_GAME_CHARACTER() { return "KILL_GAME_CHARACTER" };

    static get CHARACTER_LOOK_AT() { return "CHARACTER_LOOK_AT" };
    static get CHANGE_STAMINA() { return "CHANGE_STAMINA" };

    static get EQUIP_WEAPON() { return "EQUIP_WEAPON" };
    static get USE_ACTION() { return "USE_ACTION" };

    static get DISPLAY_FLOATING_STATUS() { return "DISPLAY_FLOATING_STATUS" };
    static get ADD_PLAYER_CHARACTER_TO_MAP() { return "ADD_PLAYER_CHARACTER_TO_MAP" };

    static get NAVIGATE_TO_CHARACTER_AND_TALK() { return "NAVIGATE_TO_CHARACTER_AND_TALK" };
    static get NAVIGATE_TO_CHARACTER_AND_ATTACK() { return "NAVIGATE_TO_CHARACTER_AND_ATTACK" };
    static get SHOW_DIALOGUE_PANEL() { return "SHOW_DIALOGUE_PANEL" };
    static get HIDE_DIALOGUE_PANEL() { return "HIDE_DIALOGUE_PANEL" };

    static get SHOW_DIALOGUE_CONTINUE_BUTTON() { return "SHOW_DIALOGUE_CONTINUE_BUTTON" };
    static get HIDE_DIALOGUE_CONTINUE_BUTTON() { return "HIDE_DIALOGUE_CONTINUE_BUTTON" };

    static get DISPLAY_DIALOGUE_STEP() { return "DISPLAY_DIALOGUE_STEP" };
    static get DISPLAY_DIALOGUE_SKILL_TEST() { return "DISPLAY_DIALOGUE_SKILL_TEST" };

    static get CONTINUE_DIALOGUE_NODE() { return "CONTINUE_DIALOGUE_NODE" };
    static get SELECT_DIALOGUE_CHOICE() { return "SELECT_DIALOGUE_CHOICE" };
    static get RESOLVE_DIALOGUE_SKILL_TEST() { return "RESOLVE_DIALOGUE_SKILL_TEST" };
    static get CLEAR_DIALOGUE_CHOICES() { return "CLEAR_DIALOGUE_CHOICES" };
    static get GO_TO_DIALOGUE_NODE() { return "GO_TO_DIALOGUE_NODE" };
    static get HANDLE_WORLD_INPUT() { return "HANDLE_WORLD_INPUT" };

    static get START_DIALOGUE() { return "START_DIALOGUE" };
    static get END_DIALOGUE() { return "END_DIALOGUE" };


    static get GAMEPLAY_ACTION_CHANGED() { return "GAMEPLAY_ACTION_CHANGED" };

    // Inventory Commands
    static get CLICK_INVENTORY_BUTTON() { return "CLICK_INVENTORY_BUTTON" };
    static get DISPLAY_INVENTORY_PANEL() { return "DISPLAY_INVENTORY_PANEL" };
    static get UPDATE_INVENTORY_PANEL() { return "UPDATE_INVENTORY_PANEL" };
    static get REORDER_INVETORY_ITEM() { return "REORDER_INVETORY_ITEM" };
    static get EQUIP_ITEM_TO_SLOT() { return "EQUIP_ITEM_TO_SLOT" };
    static get ADD_ITEM_TO_INVENTORY() { return "ADD_ITEM_TO_INVENTORY" };
    static get DISPLAY_EQUIPPED_SLOT() { return "DISPLAY_EQUIPPED_SLOT" };
    static get USE_EQUIPPED_ITEM() { return "USE_EQUIPPED_ITEM" };

    static get SET_USE_ITEM_BUTTON_HIGHLIGHT() { return "SET_USE_ITEM_BUTTON_HIGHLIGHT" };

    // Spells
    static get OPEN_SPELLBOOK() { return "OPEN_SPELLBOOK" };
    static get DISPLAY_SPELLBOOK() { return "DISPLAY_SPELLBOOK" };
    static get AWAIT_SPELL_CAST() { return "AWAIT_SPELL_CAST" };

    static get CREATE_FX() { return "CREATE_FX" };

}
