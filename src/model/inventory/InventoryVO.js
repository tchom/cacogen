import { InventoryItem } from "./items/InventoryItem";

export class InventoryVO {
    constructor() {
        this.inventoryItems = [];

        const swordWeapon = {
            id: 'sword',
            name: 'Basic Sword',
            type: 'weapon'
        };

        const bowWeapon = {
            id: 'bow',
            name: 'Bow',
            type: 'weapon'
        };

        const armour = {
            id: 'armour',
            name: 'Armour',
            type: 'armour',
            size: 3
        };


        this.addItem(swordWeapon);
        this.addItem(bowWeapon);
        this.addItem(armour);
        this.addItem(swordWeapon);
        this.addItem(bowWeapon);

    }

    addItem(itemData) {
        this.inventoryItems.push(
            new InventoryItem(itemData)
        );
    }
}