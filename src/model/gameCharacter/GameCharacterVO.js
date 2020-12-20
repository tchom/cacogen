export class GameCharacterVO {
    constructor(id) {
        this.id = id;
        this.currentNode = undefined;
        this.agroArea = undefined;
        this.roundInitiative = [];

        // Troika stats
        this.initiative = 2;
        this.maxMovement = 6;
        this.availableMovement = this.maxMovement;


    }
}