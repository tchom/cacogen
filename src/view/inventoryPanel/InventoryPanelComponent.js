export const InventoryPanelComponent = pc.createScript('InventoryPanelComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../GameFacade';
import { InventoryPanelMediator } from './InventoryPanelMediator';

InventoryPanelComponent.attributes.add('slotContainer', { type: 'entity', title: 'Slot Container' });
InventoryPanelComponent.attributes.add('itemContainer', { type: 'entity', title: 'Item Container' });
InventoryPanelComponent.attributes.add('separatorHighlight', { type: 'entity', title: 'Separator Highlight' });
InventoryPanelComponent.attributes.add('itemAsset', { type: 'asset', title: 'Item Asset' });

InventoryPanelComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(InventoryPanelMediator.NAME)) {
        this.facade.removeMediator(InventoryPanelMediator.NAME);
    }

    this.facade.registerMediator(new InventoryPanelMediator(this.entity));
    this.itemContainer.on('drag:item', this.handleItemDrag, this);
    this.itemContainer.on('move:item', this.handleItemMove, this);
    this.itemContainer.on('drop:item', this.handleItemDrop, this);

    this.separatorHighlight.enabled = false;
}

InventoryPanelComponent.prototype.handleItemDrag = function (draggedEntity) {
    this.separatorHighlight.enabled = true;
    this.setHighlightPosition(draggedEntity.getLocalPosition());
}

InventoryPanelComponent.prototype.handleItemMove = function (draggingEntity, value) {
    this.setHighlightPosition(value);
}

InventoryPanelComponent.prototype.setHighlightPosition = function (value) {
    const index = this.getSlotIndex(value);
    const separatorPos = this.getSeparatorPosition(index);
    this.separatorHighlight.setLocalPosition(separatorPos);
}

InventoryPanelComponent.prototype.handleItemDrop = function (droppedEntity) {
    this.separatorHighlight.enabled = false;

    const currentIndex = this.getIndexOfItem(droppedEntity);
    const slotIndex = this.getSlotIndex(droppedEntity.getLocalPosition());

    this.entity.fire('reorderItem', currentIndex, slotIndex);
}

InventoryPanelComponent.prototype.getSlotIndex = function (position) {
    let slotIndex = 0;
    const posY = position.y;
    const bottomSlotIndex = this.slotContainer.children.length - 1;
    const bottomSlot = this.slotContainer.children[bottomSlotIndex];

    if (posY < bottomSlot.getLocalPosition().y) {
        slotIndex = bottomSlotIndex;
    }
    for (let i = 0; i < this.slotContainer.children.length; i++) {
        const slot = this.slotContainer.children[i];
        const slotY = slot.getLocalPosition().y;

        if (posY >= slotY && posY < slotY + slot.element.height) {
            slotIndex = i;
        }
    }

    return slotIndex;
}

InventoryPanelComponent.prototype.getSeparatorPosition = function (index) {
    const slotEntity = this.slotContainer.children[index];

    return new pc.Vec3(slotEntity.getLocalPosition().x,
        slotEntity.getLocalPosition().y,
        slotEntity.getLocalPosition().z);
}

InventoryPanelComponent.prototype.getIndexOfItem = function (itemEntity) {
    return this.itemContainer.children.indexOf(itemEntity);
}


InventoryPanelComponent.prototype.displayItems = function (items) {
    this.clearPanel();

    for (const item of items) {
        const newItemComponent = this.itemAsset.resource.instantiate();
        newItemComponent.script["InventoryItemComponent"].setup(item.name, item.size);
        this.itemContainer.addChild(newItemComponent);
    }
}

InventoryPanelComponent.prototype.clearPanel = function () {
    while (this.itemContainer.children.length > 0) {
        const entity = this.itemContainer.children[0];
        entity.destroy();
    }
}