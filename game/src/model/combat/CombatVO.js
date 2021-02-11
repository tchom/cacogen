export class CombatVO {
    constructor(participants, teams) {
        this.participants = participants;
        this.roundInitiative = [];
        this.activeParticipant = undefined;
        this.teams = teams;
    }

    get nextTurnCharacterId() {
        return this.roundInitiative[0];
    }
}