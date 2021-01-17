export const OpenSpellbookButtonComponent = pc.createScript('OpenSpellbookButtonComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../../GameFacade';
import { OpenSpellbookButtonMediator } from './OpenSpellbookButtonMediator';

OpenSpellbookButtonComponent.attributes.add('highlightEntity', { type: 'entity', title: 'Highlight Entity' });

// initialize code called once per entity
OpenSpellbookButtonComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(OpenSpellbookButtonMediator.NAME)) {
        this.facade.removeMediator(OpenSpellbookButtonMediator.NAME);
    }

    this.facade.registerMediator(new OpenSpellbookButtonMediator(this.entity));

    this.entity.element.on('click', this.handleClick, this);
};

OpenSpellbookButtonComponent.prototype.handleClick = function (evt) {
    this.entity.fire('click:openSpellbook', !this.highlightEntity.enabled);
}

OpenSpellbookButtonComponent.prototype.toggleHighlight = function (isEnabled) {
    this.highlightEntity.enabled = isEnabled;
}