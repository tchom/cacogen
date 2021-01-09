export class InventoryItem {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.size = data.size ?? 1;
        this.equippable = data.equippable ?? false;
    }
}