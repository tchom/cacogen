const { Proxy } = require('@koreez/pure-mvc');
import { GameCommands } from '../../controller/GameCommands';
const { GameCharacterVO } = require('./GameCharacterVO');


export class GameCharacterProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "GameCharacterProxy_" };

    constructor(params) {
        super(GameCharacterProxy.NAME + params.id, new GameCharacterVO(params));
    }

    resetCombatTurnState() {
        this.vo.availableMovement = this.vo.maxMovement;
    }

    get combatGroup() {
        return this.vo.combatGroup;
    }

    get isNPC() {
        return this.vo.isNPC;
    }

}
