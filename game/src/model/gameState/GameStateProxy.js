const { Proxy } = require('@koreez/pure-mvc');
import { GameCommands } from '../../controller/GameCommands';
const { GameStateVO } = require('./GameStateVO');


export class GameStateProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "GameStateProxy" };

    constructor() {
        super(GameStateProxy.NAME, new GameStateVO());
    }

    updateGameStateType(newStateType) {
        this.vo.gameplayMode = newStateType;
    }

    get currentMode() {
        return this.vo.gameplayMode;
    }

    get currentAction() {
        return this.vo.selectedAction;
    }

    set currentAction(value) {
        this.vo.selectedAction = value;
    }

    get selectedSpellCommand() {
        return this.vo.selectedSpellCommand;
    }

    set selectedSpellCommand(value) {
        this.vo.selectedSpellCommand = value;
    }
}
