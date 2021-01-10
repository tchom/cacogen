import { createUUID } from '../../../utils/GUID';

export class InventoryItem {
    constructor(data) {
        this.uuid = createUUID();
        this.id = data.id;
        this.icon = data.icon;
        this.name = data.name;
        this.description = data.description;
        this.type = data.type;
        this.size = data.size ?? 1;
        this.equipSlot = data.equipSlot ?? "none";
    }
}