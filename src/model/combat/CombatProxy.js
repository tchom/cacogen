const { Proxy } = require('@koreez/pure-mvc');
import { GameCommands } from '../../controller/GameCommands';
const { CombatVO } = require('./CombatVO');


export class CombatProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "CombatProxy_" };

    constructor(instigatorId) {
        super(CombatProxy.NAME + instigatorId, new CombatVO(instigatorId));
    }

}
