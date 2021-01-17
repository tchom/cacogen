export const gameplayModeTypes = {
    EXPLORATION: 'EXPLORATION',
    COMBAT: 'COMBAT',
    DIALOGUE: 'DIALOGUE',
    GAME_OVER: 'GAME_OVER',

}

export class GameStateVO {
    constructor() {
        this.gameplayMode = gameplayModeTypes.EXPLORATION;
        this.selectedAction = "none";
        this.selectedSpellCommand = undefined;
    }
}