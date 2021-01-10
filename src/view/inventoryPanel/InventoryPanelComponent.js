
const equipmentSlotSchema = [
    {
        name: 'key',
        title: 'Equipment Slot Key',
        type: 'string'
    },
    {
        name: 'entity',
        title: 'Equipment Slot Entity',
        type: 'entity'
    }
];

export const InventoryPanelComponent = pc.createScript('InventoryPanelComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../GameFacade';
import { InventoryPanelMediator } from './InventoryPanelMediator';

InventoryPanelComponent.attributes.add('slotContainer', { type: 'entity', title: 'Slot Container' });
InventoryPanelComponent.attributes.add('topSlotPosition', { type: 'entity', title: 'Top Slot Position' });
InventoryPanelComponent.attributes.add('separatorHighlight', { type: 'entity', title: 'Separator Highlight' });
InventoryPanelComponent.attributes.add('closeButton', { type: 'entity', title: 'Close Button' });
InventoryPanelComponent.attributes.add('itemAsset', { type: 'asset', title: 'Item Asset' });

InventoryPanelComponent.attributes.add('dragIcon', { type: 'entity', title: 'Drag Icon' });
InventoryPanelComponent.attributes.add('slotWidth', { type: 'number', title: 'Slot Width', default: 320 });
InventoryPanelComponent.attributes.add('slotHeight', { type: 'number', title: 'Slot Height', default: 44 });
InventoryPanelComponent.attributes.add('maxSlots', { type: 'number', title: 'Max Slots', default: 12 });

InventoryPanelComponent.attributes.add('equipmentSlots', { type: 'json', schema: equipmentSlotSchema, array: true, title: 'Equipment Slots' });

InventoryPanelComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(InventoryPanelMediator.NAME)) {
        this.facade.removeMediator(InventoryPanelMediator.NAME);
    }

    this.facade.registerMediator(new InventoryPanelMediator(this.entity));
    this.entity.on('drag:start', this.handleDragStart, this);
    this.closeButton.element.on('click', this.handleClose, this);

    this.separatorHighlight.enabled = false;
    this.inventoryItemEntities = [];
}

InventoryPanelComponent.prototype.handleDragStart = function (dragEntity, size) {
    dragEntity.reparent(this.entity);
    this.dragIcon.reparent(this.entity);

    this.entity.element.on(pc.EVENT_MOUSEMOVE, (evt) => {
        this.handleMouseMove(dragEntity, size, evt);
    }, this);

    this.entity.element.on(pc.EVENT_MOUSEUP, (evt) => {
        this.handleMouseUp(dragEntity, size, evt);
    }, this);
}

InventoryPanelComponent.prototype.localPositionFromMouseEvent = function (evt) {
    const screenPos = new pc.Vec3(evt.x, evt.y, 0);
    const pixelRatio = this.app.graphicsDevice.maxPixelRatio;
    screenPos.x *= pixelRatio;
    screenPos.y *= pixelRatio;

    const screenComp = this.entity.element.screen.screen;
    const device = this.app.graphicsDevice;

    const ratioScale = screenComp.scale;
    const x = (screenPos.x / ratioScale);
    const y = (device.height - screenPos.y) / ratioScale;

    return new pc.Vec3(x, y, 0);
}

InventoryPanelComponent.prototype.handleMouseMove = function (dragEntity, size, evt) {
    const newPosition = this.localPositionFromMouseEvent(evt);
    this.dragIcon.setLocalPosition(newPosition);

    this.displayPotentialList(dragEntity, size, newPosition);

}



InventoryPanelComponent.prototype.handleMouseUp = function (dragEntity, size, evt) {
    const dragPos = this.localPositionFromMouseEvent(evt);
    this.dragIcon.enabled = false;
    dragEntity.script['InventoryItemComponent'].expand();
    this.entity.element.off(pc.EVENT_MOUSEMOVE);
    this.entity.element.off(pc.EVENT_MOUSEUP);

    const topSlotPosition = this.topSlotPosition.getLocalPosition();
    const bounds = {
        x1: topSlotPosition.x, y1: topSlotPosition.y - this.maxSlots * this.slotHeight,
        x2: topSlotPosition.x + this.slotWidth, y2: topSlotPosition.y
    };

    const inBounds = isInBounds(dragPos, bounds);
    if (inBounds) {
        const screenHeight = this.app.graphicsDevice.height;

        // Get the top corner position of the dragging item as the target
        const cornerScreenPos = { x: dragEntity.element.screenCorners[2].x, y: screenHeight - dragEntity.element.screenCorners[2].y }
        const cornerPos = this.localPositionFromMouseEvent(cornerScreenPos);

        const slotIndex = Math.max(0, Math.floor((topSlotPosition.y - cornerPos.y) / this.slotHeight));
        const originalIndex = dragEntity.script['InventoryItemComponent'].orderIndex;
        this.entity.fire('reorderItem', originalIndex, slotIndex);
    } else {
        // Check if dropped in equip slot
        this.checkDropOnEquipmentSlot(dragEntity, evt);
    }
}

InventoryPanelComponent.prototype.checkDropOnEquipmentSlot = function (draggingEntity, mouseEvent) {
    for (const equipSlot of this.equipmentSlots) {
        const equipSlotKey = equipSlot.key;
        const equipSlotEntity = equipSlot.entity;
        const corners = equipSlotEntity.element.screenCorners;
        const height = this.app.graphicsDevice.height;
        const point = { x: mouseEvent.x, y: height - mouseEvent.y };
        const bounds = {
            x1: corners[0].x, y1: corners[0].y,
            x2: corners[2].x, y2: corners[2].y,
        };

        if (isInBounds(point, bounds)) {
            const itemIndex = draggingEntity.script["InventoryItemComponent"].orderIndex;

            this.entity.fire('equipItem', itemIndex, equipSlotKey);
        }
    }

}

InventoryPanelComponent.prototype.handleItemMove = function (draggingEntity, value) {
    if (this.isInBounds(value)) {
        draggingEntity.script['InventoryItemComponent'].expand();
        this.separatorHighlight.enabled = true;
    } else {
        draggingEntity.script['InventoryItemComponent'].collapse();
        this.separatorHighlight.enabled = false;
    }
    this.setHighlightPosition(value);
}

function isInBounds(point, bounds) {
    return point.x > bounds.x1 && point.x < bounds.x2 && point.y > bounds.y1 && point.y < bounds.y2;
}

InventoryPanelComponent.prototype.handleClose = function () {
    return this.entity.enabled = false;
}

InventoryPanelComponent.prototype.displayItems = function (items, equippedMap) {
    this.clearPanel();
    const topSlotPosition = this.topSlotPosition.getLocalPosition();
    let runningIndex = 0;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        runningIndex += item.size;

        const newItemComponent = this.itemAsset.resource.instantiate();
        newItemComponent.script["InventoryItemComponent"].setup(item.icon, item.name, item.size, i);
        newItemComponent.setLocalPosition(topSlotPosition.x, topSlotPosition.y - (runningIndex * this.slotHeight), 0);

        this.inventoryItemEntities.push(newItemComponent);

        this.entity.addChild(newItemComponent);
    }

    for (const equipSlot of this.equipmentSlots) {
        const equipSlotKey = equipSlot.key;
        const equipSlotEntity = equipSlot.entity;

        if (equippedMap.has(equipSlotKey)) {
            const equippedItem = equippedMap.get(equipSlotKey);
            equipSlotEntity.script["InventoryEquippedSlotComponent"].setup(equippedItem.icon);
        } else {
            equipSlotEntity.script["InventoryEquippedSlotComponent"].clear();
        }

    }
}

InventoryPanelComponent.prototype.displayPotentialList = function (dragEntity, size, dragPos) {
    const topSlotPosition = this.topSlotPosition.getLocalPosition();
    const bounds = {
        x1: topSlotPosition.x, y1: topSlotPosition.y - this.maxSlots * this.slotHeight,
        x2: topSlotPosition.x + this.slotWidth, y2: topSlotPosition.y
    };

    const inBounds = isInBounds(dragPos, bounds);
    if (inBounds) {
        // Do the stuff
        dragEntity.script['InventoryItemComponent'].expand();
        this.dragIcon.enabled = false;
        const screenHeight = this.app.graphicsDevice.height;

        // Get the top corner position of the dragging item as the target
        const cornerScreenPos = { x: dragEntity.element.screenCorners[2].x, y: screenHeight - dragEntity.element.screenCorners[2].y }
        const cornerPos = this.localPositionFromMouseEvent(cornerScreenPos);

        const slotIndex = Math.max(0, Math.floor((topSlotPosition.y - cornerPos.y) / this.slotHeight));
        this.reorderListWithGap(dragEntity, dragEntity.script['InventoryItemComponent'].size, slotIndex);

    } else {
        this.separatorHighlight.enabled = false;
        dragEntity.script['InventoryItemComponent'].collapse();
        this.dragIcon.enabled = true;
    }
}

InventoryPanelComponent.prototype.reorderListWithGap = function (dragEntity, size, gapIndex) {
    const topSlotPosition = this.topSlotPosition.getLocalPosition();
    let runningIndex = 0;

    for (let i = 0; i < this.inventoryItemEntities.length; i++) {
        const inventoryItemEntity = this.inventoryItemEntities[i];

        // Don't reposition the entity being dragged
        if (dragEntity !== inventoryItemEntity) {
            if (gapIndex >= runningIndex && gapIndex < runningIndex + inventoryItemEntity.script["InventoryItemComponent"].size) {
                runningIndex += size;
            }
            runningIndex += inventoryItemEntity.script["InventoryItemComponent"].size;

            inventoryItemEntity.setLocalPosition(topSlotPosition.x, topSlotPosition.y - (runningIndex * this.slotHeight), 0);
        }
    }
}


InventoryPanelComponent.prototype.clearPanel = function () {
    while (this.inventoryItemEntities.length > 0) {
        const entity = this.inventoryItemEntities.pop();
        entity.destroy();
    }
}
