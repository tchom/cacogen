export const InventoryEquippedSlotComponent = pc.createScript('InventoryEquippedSlotComponent');

InventoryEquippedSlotComponent.attributes.add('defaultAsset', { type: 'asset', title: 'Default Asset' });

InventoryEquippedSlotComponent.attributes.add('iconEntity', { type: 'entity', title: 'Icon Entity' });

InventoryEquippedSlotComponent.prototype.initialize = function () { }

InventoryEquippedSlotComponent.prototype.setup = function (iconAssetId) {
    const asset = this.app.assets.get(iconAssetId);
    this.iconEntity.element.spriteAsset = asset;

}


InventoryEquippedSlotComponent.prototype.clear = function () {
    this.iconEntity.element.spriteAsset = this.defaultAsset;
}