const { Proxy } = require('@koreez/pure-mvc');
import { GameCommands } from '../../controller/GameCommands';
import { shuffleArray } from '../../utils/ShuffleArray';
import { GameCharacterProxy } from '../gameCharacter/GameCharacterProxy';
const { CombatVO } = require('./CombatVO');


export class CombatProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "CombatProxy" };

    constructor(participants, teams) {
        super(CombatProxy.NAME, new CombatVO(participants, teams));
    }

    onRegister() {
        const participants = [...this.vo.participants];
        this.participantProxies = new Map();
        for (const participant of participants) {
            const participantProxy = this.facade.retrieveProxy(GameCharacterProxy.NAME + participant);
            if (!participantProxy.isDead) {
                this.participantProxies.set(participant, participantProxy);
            } else {
                // Already dead... move on
                this.vo.participants = this.vo.participants.filter(e => e !== participant)
            }
        }
    }

    nextTurn() {
        const roundInitiative = this.vo.roundInitiative;

        if (roundInitiative && roundInitiative.length > 0) {
            const nextTurnId = roundInitiative.shift();
            this.vo.activeParticipant = nextTurnId;

            if (nextTurnId !== 'end_round') {
                // Next Turn
                this.facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `Turn ${nextTurnId}`);
                const proxy = this.participantProxies.get(nextTurnId);
                proxy.resetCombatTurnState();

                if (proxy.isNPC) {
                    this.facade.sendNotification(GameCommands.DETERMINE_NEXT_ENEMY_ACTION, nextTurnId);
                } else {
                    this.facade.sendNotification(GameCommands.AWAIT_PLAYER_COMBAT_INPUT, nextTurnId);
                }
            } else {
                // End round
                this.facade.sendNotification(GameCommands.SHOW_TOAST_MESSAGE, `End round`);
                setTimeout(() => {
                    this.facade.sendNotification(GameCommands.NEXT_COMBAT_ROUND);
                }, 3000);
            }
        }
    }

    nextRound() {
        console.log('/////////////////');
        console.log('//  New round  //');
        console.log('/////////////////');
        const initiatives = [];
        for (const [characterId, proxy] of this.participantProxies.entries()) {
            const vo = proxy.vo;
            for (let i = 0; i < vo.initiative; i++) {
                initiatives.push(characterId);
            }
        }

        if (initiatives.length === 0) {
            // Everyone is out of the combat somehow, probably dead
            this.facade.sendNotification(GameCommands.END_COMBAT);
            return;
        }

        // Add end of round token
        initiatives.push('end_round');

        let shuffledInitiative = shuffleArray(initiatives);
        // ensure round doesn't start with "end_round"
        while (shuffledInitiative[0] === "end_round") {
            shuffledInitiative = shuffleArray(shuffledInitiative)
        }

        this.vo.roundInitiative = shuffledInitiative;
    }

    get nextTurnCharacterId() {
        return this.vo.nextTurnCharacterId;
    }

    get activeParticipant() {
        return this.vo.activeParticipant;
    }

    set activeParticipant(value) {
        this.vo.activeParticipant = value;
    }

    get participants() {
        return this.vo.participants;
    }

    get teams() {
        return this.vo.teams;
    }

    removeCharacterFromCombat(characterId) {
        // remove from particcipants
        this.participantProxies.delete(characterId);
        // remove from initiative
        this.vo.roundInitiative = this.vo.roundInitiative.filter(e => e !== characterId);

        for (const [key, team] of this.teams.entries()) {

            const characterIndex = team.indexOf(characterId);
            if (characterIndex > -1) {
                team.splice(characterIndex, 1);
            }

            if (team.length === 0) {
                this.facade.sendNotification(GameCommands.END_COMBAT, key);
            }
        }
    }

}
