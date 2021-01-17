const { Proxy } = require('@koreez/pure-mvc');
import { SpellsVO } from './SpellsVo';

export class SpellsProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "SpellsProxy" };

    constructor(data) {
        super(SpellsProxy.NAME, new SpellsVO(data));
    }

    retieveSpellDefinition(spellKey) {
        if (this.vo.spellsLibrary.hasOwnProperty(spellKey)) {
            return this.vo.spellsLibrary[spellKey];
        }
        return undefined;
    }

    get spellsLibrary() {
        return this.vo.spellsLibrary;
    }
}