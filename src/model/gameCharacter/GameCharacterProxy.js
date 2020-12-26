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
        this.vo.availableAction = this.vo.maxActionsPerTurn;
    }

    useMovement(cost) {
        this.vo.availableMovement -= cost;
    }

    get id() {
        return this.vo.id;
    }

    get currentNode() {
        return this.vo.currentNode;
    }

    set currentNode(value) {
        if (this.vo.currentNode) {
            this.vo.currentNode.occupied = false;
        }

        this.vo.currentNode = value;
        this.vo.currentNode.occupied = true;
    }

    get combatGroup() {
        return this.vo.combatGroup;
    }

    get isNPC() {
        return this.vo.isNPC;
    }

    get availableActions() {
        return this.vo.availableAction;
    }

    get skill() {
        return this.vo.skill;
    }

    get currentStamina() {
        return this.vo.currentStamina;
    }

    get currentLuck() {
        return this.vo.currentStamina;
    }

}
