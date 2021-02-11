export class BotBehaviourTypes {
    static get NONE() { return 0 };
    static get BASIC_MELEE() { return 1 };
    static get BASIC_RANGED() { return 2 };

}

export const botBehaviourEnums = [
    { NONE: BotBehaviourTypes.NONE },
    { BASIC_MELEE: BotBehaviourTypes.BASIC_MELEE },
    { BASIC_RANGED: BotBehaviourTypes.BASIC_RANGED },
]