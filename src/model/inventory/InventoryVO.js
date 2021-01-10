import { InventoryItem } from "./items/InventoryItem";

export class InventoryVO {
    constructor() {
        this.inventoryItems = [];
        this.equipmentSlots = new Map();

    }

    addItem(itemData) {
        this.inventoryItems.push(
            new InventoryItem(itemData)
        );
    }
}