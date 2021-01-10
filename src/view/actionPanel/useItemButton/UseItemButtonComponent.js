export const UseItemButtonComponent = pc.createScript('UseItemButtonComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../../GameFacade';
import { UseItemButtonMediator } from './UseItemButtonMediator';

UseItemButtonComponent.attributes.add('equipmentSlotKey', { type: 'string', title: 'Equipment Slot Key' });
UseItemButtonComponent.attributes.add('iconEntity', { type: 'entity', title: 'Icon Entity' });
UseItemButtonComponent.attributes.add('highlightEntity', { type: 'entity', title: 'Highlight Entity' });
UseItemButtonComponent.attributes.add('defaultIcon', { type: 'asset', title: 'Default Icon' });

// initialize code called once per entity
UseItemButtonComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(UseItemButtonMediator.NAME + this.equipmentSlotKey)) {
        this.facade.removeMediator(UseItemButtonMediator.NAME + this.equipmentSlotKey);
    }

    this.facade.registerMediator(new UseItemButtonMediator(this.entity, this.equipmentSlotKey));

    this.entity.element.on('click', this.handleClick, this);
};

UseItemButtonComponent.prototype.setIcon = function (assetId) {
    const iconAsset = this.app.assets.get(assetId);
    this.iconEntity.element.spriteAsset = iconAsset;
}

UseItemButtonComponent.prototype.setDefaultIcon = function () {
    this.iconEntity.element.spriteAsset = this.defaultIcon;
}

UseItemButtonComponent.prototype.handleClick = function (evt) {
    this.entity.fire('click:useItem');
}

UseItemButtonComponent.prototype.toggleHighlight = function (isEnabled) {
    this.highlightEntity.enabled = isEnabled;
}