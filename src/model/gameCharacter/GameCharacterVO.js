export class GameCharacterVO {
    constructor(params) {
        this.id = params.id;
        this.isNPC = params.isNPC;
        this.combatGroup = params.combatGroup || [];
        this.currentNode = undefined;
        this.agroArea = undefined;
        this.roundInitiative = [];

        // Troika stats
        this.initiative = 2;
        this.maxMovement = 6;
        this.maxActionsPerTurn = 1;
        this.availableAction = this.maxActionsPerTurn;
        this.availableMovement = this.maxMovement;


    }
}