export const InventoryItemComponent = pc.createScript('InventoryItemComponent');

InventoryItemComponent.attributes.add('labelEntity', { type: 'entity', title: 'Label Entity' });
InventoryItemComponent.attributes.add('slotHeight', { type: 'number', title: 'Slot Height', default: 44 });


InventoryItemComponent.prototype.initialize = function () {
    this._handleDragHelper = new pc.ElementDragHelper(this.entity.element, 'y');
    this._handleDragHelper.on('drag:start', this.onHandleDrag, this);
    this._handleDragHelper.on('drag:move', this.onHandleMove, this);
    this._handleDragHelper.on('drag:end', this.onHandleDrop, this);
}

InventoryItemComponent.prototype.setup = function (name, size) {
    this.labelEntity.element.text = name;
    this.entity.element.height = this.slotHeight * size;

}


InventoryItemComponent.prototype.onHandleDrag = function () {
    this.entity.parent.fire('drag:item', this.entity);
}

InventoryItemComponent.prototype.onHandleMove = function (value) {
    this.entity.parent.fire('move:item', this.entity, value);
}

InventoryItemComponent.prototype.onHandleDrop = function () {
    this.entity.parent.fire('drop:item', this.entity);
}