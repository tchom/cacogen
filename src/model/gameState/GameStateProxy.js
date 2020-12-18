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

}
