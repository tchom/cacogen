const { Proxy } = require('@koreez/pure-mvc');
import { GameCommands } from '../../controller/GameCommands';
const { GameCharacterVO } = require('./GameCharacterVO');


export class GameCharacterProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "GameCharacterProxy_" };

    constructor(id) {
        super(GameCharacterProxy.NAME + id, new GameCharacterVO(id));
    }

}
