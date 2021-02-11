export const SpellbookPanelButtonComponent = pc.createScript('SpellbookPanelButtonComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../../GameFacade';
import { SpellbookPanelMediator } from './SpellbookPanelMediator';

SpellbookPanelButtonComponent.attributes.add('titleLabelEntity', { type: 'entity', title: 'Title label entity' });


// initialize code called once per entity
SpellbookPanelButtonComponent.prototype.initialize = function () {

};

SpellbookPanelButtonComponent.prototype.setup = function (spellData) {
    this.titleLabelEntity.element.text = spellData.name;
}
