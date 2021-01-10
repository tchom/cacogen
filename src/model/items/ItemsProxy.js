const { Proxy } = require('@koreez/pure-mvc');


export class ItemsProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "ItemsProxy" };

    constructor(data) {
        super(ItemsProxy.NAME, data);
    }

    getItemData(itemId) {
        for (const categoryKey in this.vo) {
            if (Object.hasOwnProperty.call(this.vo, categoryKey)) {
                const category = this.vo[categoryKey];
                console.log(category);
                if (Object.hasOwnProperty.call(category, itemId)) {

                    return {
                        id: itemId,
                        type: categoryKey,
                        ...this.vo[categoryKey][itemId]
                    };
                }
            }
        }

        throw new Error(`Cannot find data for item:: ${itemId}`);

    }
}