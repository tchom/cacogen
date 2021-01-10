export const InventoryEquippedSlotComponent = pc.createScript('InventoryEquippedSlotComponent');

/*InventoryEquippedSlotComponent.attributes.add('labelEntity', { type: 'entity', title: 'Label Entity' });
InventoryEquippedSlotComponent.attributes.add('slotHeight', { type: 'number', title: 'Slot Height', default: 44 });*/

InventoryEquippedSlotComponent.attributes.add('iconEntity', { type: 'entity', title: 'Icon Entity' });

InventoryEquippedSlotComponent.prototype.initialize = function () {
    this.iconEntity.enabled = false;
}

InventoryEquippedSlotComponent.prototype.setup = function (value) {
    this.iconEntity.enabled = value;
}

