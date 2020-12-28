const { Proxy } = require('@koreez/pure-mvc');


export class WeaponsProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "WeaponsProxy" };

    constructor(data) {
        super(WeaponsProxy.NAME, data);
    }

    getDamage(weaponName, damageTier) {
        for (const categoryKey in this.vo) {
            if (Object.hasOwnProperty.call(this.vo, categoryKey)) {
                const category = this.vo[categoryKey];

                if (Object.hasOwnProperty.call(category, weaponName)) {
                    return category[weaponName].damage[Math.min(damageTier - 1, 6)];
                }
            }
        }

        throw new Error(`Cannot find weapon:: ${weaponName}`);
    }

    getWeaponCategory(weaponName) {
        for (const categoryKey in this.vo) {
            if (Object.hasOwnProperty.call(this.vo, categoryKey)) {
                const category = this.vo[categoryKey];
                if (Object.hasOwnProperty.call(category, weaponName)) {
                    return categoryKey;
                }
            }
        }

        throw new Error(`Cannot category for weapon:: ${weaponName}`);

    }
}