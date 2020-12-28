export class WeaponTypes {
    // MELEE
    static get SWORD() { return "sword" };
    static get AXE() { return "axe" };
    static get KNIFE() { return "knife" };
    static get STAFF() { return "staff" };
    static get HAMMER() { return "hammer" };
    static get SPEAR() { return "spear" };
    static get MACE() { return "mace" };
    static get POLEARM() { return "polearm" };
    static get MAUL() { return "maul" };
    static get GREATSWORD() { return "greatsword" };
    static get CLUB() { return "club" };
    static get UNARMED() { return "unarmed" };
    static get SHIELD() { return "shield" };

    // RANGED
    static get FUSIL() { return "fusil" };
    static get BOW() { return "bow" };
    static get CROSSBOW() { return "crossbow" };
    static get PISTOLET() { return "pistolet" };
}

export const weaponEnums = Object.entries(Object.getOwnPropertyDescriptors(WeaponTypes))
    .filter(([key, descriptor]) => typeof descriptor.get === 'function')
    .map(([key]) => {
        return { [key]: WeaponTypes[key] };
    });