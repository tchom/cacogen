export const AttackButtonComponent = pc.createScript('AttackButtonComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../../GameFacade';
import { AttackButtonMediator } from './AttackButtonMediator';

AttackButtonComponent.attributes.add('highlightEntity', { type: 'entity', title: 'Highlight Entity' });

// initialize code called once per entity
AttackButtonComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(AttackButtonMediator.NAME)) {
        this.facade.removeMediator(AttackButtonMediator.NAME);
    }

    this.facade.registerMediator(new AttackButtonMediator(this.entity));

    this.entity.element.on('click', this.handleClick, this);
};

AttackButtonComponent.prototype.handleClick = function (evt) {
    this.entity.fire('click:toggleAttack', !this.highlightEntity.enabled);
}

AttackButtonComponent.prototype.toggleHighlight = function (isEnabled) {
    this.highlightEntity.enabled = isEnabled;
}