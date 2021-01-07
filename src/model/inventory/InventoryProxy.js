const { Proxy } = require('@koreez/pure-mvc');
import { GameCommands } from '../../controller/GameCommands';
const { InventoryVO } = require('./InventoryVO');


export class InventoryProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "InventoryProxy" };

    constructor() {
        super(InventoryProxy.NAME, new InventoryVO());
    }

    get inventoryItems() {
        return this.vo.inventoryItems;
    }

    set inventoryItems(value) {
        this.vo.inventoryItems = value;
    }

    reorderInventoryItem(originalIndex, slotIndex) {
        let runningIndexTotal = 0;
        let newIndex = 0;
        for (let i = 0; i < this.inventoryItems.length; i++) {
            const item = this.inventoryItems[i];

            if (slotIndex >= runningIndexTotal && slotIndex < runningIndexTotal + item.size) {
                newIndex = i;
            }

            runningIndexTotal += item.size;
        }

        if (slotIndex >= runningIndexTotal) {
            newIndex = this.inventoryItems.length - 1;
        }

        // Make sure a valid array is provided
        if (Object.prototype.toString.call(this.inventoryItems) !== '[object Array]') {
            throw new Error('Please provide a valid array');
        }

        // Delete the item from it's current position
        const item = this.inventoryItems.splice(originalIndex, 1);

        // Make sure there's an item to move
        if (!item.length) {
            throw new Error('There is no item in the array at index ' + originalIndex);
        }

        // Move the item to its new position
        this.inventoryItems.splice(newIndex, 0, item[0]);
    }

}