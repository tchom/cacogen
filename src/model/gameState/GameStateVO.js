export const gameplayModeTypes = {
    EXPLORATION: 'EXPLORATION',
    COMBAT: 'COMBAT',
    DIALOGUE: 'DIALOGUE',

}

export class GameStateVO {
    constructor() {
        this.gameplayMode = gameplayModeTypes.EXPLORATION;
    }
}