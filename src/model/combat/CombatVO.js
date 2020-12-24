export class CombatVO {
    constructor(participants) {
        this.participants = participants;
        this.roundInitiative = [];
        this.activeParticipant = undefined;
    }

    get nextTurnCharacterId() {
        return this.roundInitiative[0];
    }
}