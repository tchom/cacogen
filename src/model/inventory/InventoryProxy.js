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

    get equipmentSlots() {
        return this.vo.equipmentSlots;
    }


    reorderInventoryItem(itemUUID, slotIndex) {
        // Delete the item from it's current position
        const originalIndex = this.inventoryItems.findIndex(item => item.uuid === itemUUID);
        const originalItem = this.inventoryItems.splice(originalIndex, 1);
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
            newIndex = this.inventoryItems.length;
        }

        // Make sure a valid array is provided
        if (Object.prototype.toString.call(this.inventoryItems) !== '[object Array]') {
            throw new Error('Please provide a valid array');
        }



        // Make sure there's an item to move
        if (!originalItem.length) {
            throw new Error('There is no item in the array at index ' + originalIndex);
        }

        // Move the item to its new position
        this.inventoryItems.splice(newIndex, 0, originalItem[0]);
    }

    attemptToEquipItemToSlot(slotKey, itemData) {
        // check equip weapon
        if ((slotKey === '1hand' || slotKey === '2hand') && itemData.type === "weapon") {
            const existingItem = this.equipmentSlots.get(slotKey);

            // Clear both slots it last item was two-handed
            if (existingItem && existingItem.equipSlot === '2hand') {
                this.equipmentSlots.delete('1hand');
                this.equipmentSlots.delete('2hand');
            }

            if (itemData.equipSlot === '1hand') {
                this.equipmentSlots.set(slotKey, itemData);
                // make sure this isn't already equipped in the other hand
                if (slotKey === '1hand') {
                    const otherSlot = this.equipmentSlots.get('2hand');
                    if (otherSlot && otherSlot.uuid === itemData.uuid) {
                        this.equipmentSlots.delete('2hand');
                    }
                } else if (slotKey === '2hand') {
                    const otherSlot = this.equipmentSlots.get('1hand');
                    if (otherSlot && otherSlot.uuid === itemData.uuid) {
                        this.equipmentSlots.delete('1hand');
                    }
                }


            } else {
                this.equipmentSlots.set('1hand', itemData);
                this.equipmentSlots.set('2hand', itemData);

            }

            return true;
        }

        return false;
    }

    addInventoryItem(inventoryItemData) {
        this.inventoryItems.push(inventoryItemData);
    }

}