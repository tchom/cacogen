export const InventoryItemComponent = pc.createScript('InventoryItemComponent');

InventoryItemComponent.attributes.add('iconEntity', { type: 'entity', title: 'Icon Entity' });
InventoryItemComponent.attributes.add('labelEntity', { type: 'entity', title: 'Label Entity' });
InventoryItemComponent.attributes.add('slotHeight', { type: 'number', title: 'Slot Height', default: 44 });

InventoryItemComponent.attributes.add('expandedEntity', { type: 'entity', title: 'Expanded Entity' });

// Display Methods
InventoryItemComponent.prototype.setup = function (icon, name, size, orderIndex) {
    const iconAsset = this.app.assets.get(icon);
    this.iconEntity.element.spriteAsset = iconAsset;
    this.icon = icon;
    this.size = size;
    this.labelEntity.element.text = name;
    this.entity.element.height = this.slotHeight * size;
    this.expandedEntity.element.height = this.slotHeight * size;
    this.orderIndex = orderIndex;
}

InventoryItemComponent.prototype.collapse = function () {
    this.expandedEntity.enabled = false;
}

InventoryItemComponent.prototype.expand = function () {
    this.expandedEntity.enabled = true;
}

// Drag methods
InventoryItemComponent.prototype.postInitialize = function () {

    const dragHelper = new pc.ElementDragHelper(this.entity.element, null);
    dragHelper.on('drag:start', this.onDragStart, this);
};

InventoryItemComponent.prototype.onDragStart = function () {
    this.entity.parent.fire('drag:start', this.entity, this.size);
}
