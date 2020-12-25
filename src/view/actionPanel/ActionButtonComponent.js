export const ActionButtonComponent = pc.createScript('ActionButtonComponent');
import { Facade } from '@koreez/pure-mvc';

ActionButtonComponent.attributes.add('action', { type: 'string', title: 'Action' });
ActionButtonComponent.attributes.add('highlightEntity', { type: 'entity', title: 'Highlight Entity' });
ActionButtonComponent.attributes.add('iconEntity', { type: 'entity', title: 'Icon Entity' });
ActionButtonComponent.attributes.add('iconAsset', { type: 'asset', title: 'Icon Asset' });

// initialize code called once per entity
ActionButtonComponent.prototype.initialize = function () {
    this.highlightEntity.enabled = false;
    this.entity.on('select:action', this.handleChangeAction, this);
    this.entity.element.on('click', this.handleClick, this);
};

ActionButtonComponent.prototype.handleClick = function (evt) {
    this.entity.parent.fire('click:actionButton', this.action);
}

ActionButtonComponent.prototype.handleChangeAction = function (action) {
    this.highlightEntity.enabled = (this.action === action);
}