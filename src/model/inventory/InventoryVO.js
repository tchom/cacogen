import { InventoryItem } from "./items/InventoryItem";

export class InventoryVO {
    constructor() {
        this.inventoryItems = [];

        this.addItem("Test One");
        this.addItem("Test Two");
        this.addItem("Test Three");
        this.addItem("Test Four");
        this.addItem("Test Five", 3);

    }

    addItem(itemName, size = 1) {
        this.inventoryItems.push(
            new InventoryItem(itemName, size)
        );
    }
}