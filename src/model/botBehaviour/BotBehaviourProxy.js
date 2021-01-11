const { Proxy } = require('@koreez/pure-mvc');
const { BotBehavioursVO } = require('./BotBehavioursVO');


export class BotBehaviourProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "BotBehaviourProxy" };

    constructor() {
        super(BotBehaviourProxy.NAME, new BotBehavioursVO());
    }

    getTree(type) {
        return this.vo.getTree(type);
    }
}
