export class GameCharacterVO {
    constructor(params) {
        this.id = params.id;
        this.isNPC = params.isNPC;
        this.combatGroup = params.combatGroup || [];
        this.currentNode = undefined;
        this.agroArea = undefined;

        // Troika stats
        this.initiative = 2;
        this.maxMovement = 6;
        this.maxActionsPerTurn = 1;
        this.availableActions = this.maxActionsPerTurn;
        this.availableMovement = this.maxMovement;

        this.skill = params.skill || 1;

        this.maxStamina = params.maxStamina || 1;
        this.currentStamina = this.maxStamina;

        this.maxLuck = params.maxLuck || 1;
        this.currentLuck = this.maxLuck;

        this.advancedSkills = params.advancedSkills || {};

        this.botBehaviour = params.botBehaviour || 0;

    }
}