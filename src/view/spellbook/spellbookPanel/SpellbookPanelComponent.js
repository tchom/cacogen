export const SpellbookPanelComponent = pc.createScript('SpellbookPanelComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../../GameFacade';
import { SpellbookPanelMediator } from './SpellbookPanelMediator';
import { SpellbookPanelButtonComponent } from './SpellbookPanelButtonComponent';

// Spells list
SpellbookPanelComponent.attributes.add('spellButtonTemplate', { type: 'asset', title: 'Spell Button Template' });
SpellbookPanelComponent.attributes.add('spellListContainer', { type: 'entity', title: 'Spell List Container' });
// Details
SpellbookPanelComponent.attributes.add('detailsNameEntity', { type: 'entity', title: 'Details Name Entity' });
SpellbookPanelComponent.attributes.add('detailsCostEntity', { type: 'entity', title: 'Details Cost Entity' });
SpellbookPanelComponent.attributes.add('detailsDescriptionEntity', { type: 'entity', title: 'Details Description Entity' });
SpellbookPanelComponent.attributes.add('detailsIconEntity', { type: 'entity', title: 'Details Icon Entity' });

SpellbookPanelComponent.attributes.add('castButton', { type: 'entity', title: 'Cast Button' });
SpellbookPanelComponent.attributes.add('closeButton', { type: 'entity', title: 'Close Button' });


// initialize code called once per entity
SpellbookPanelComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(SpellbookPanelMediator.NAME)) {
        this.facade.removeMediator(SpellbookPanelMediator.NAME);
    }

    this.facade.registerMediator(new SpellbookPanelMediator(this.entity));

    this.entity.enabled = false;

    this.closeButton.element.on('click', this.handleClose, this);
};

SpellbookPanelComponent.prototype.open = function (spellsDict) {
    this.clearPanel();
    let defaultShown = false;
    for (const spellKey in spellsDict) {
        if (Object.hasOwnProperty.call(spellsDict, spellKey)) {
            const spellData = spellsDict[spellKey];

            const spellbutton = this.spellButtonTemplate.resource.instantiate();
            spellbutton.script['SpellbookPanelButtonComponent'].setup(spellData);
            this.spellListContainer.addChild(spellbutton);

            if (!defaultShown) {
                defaultShown = true;
                this.displayDetails(spellKey, spellData);
            }

            spellbutton.element.on('click', () => {
                this.displayDetails(spellKey, spellData);
            })
        }
    }
}

SpellbookPanelComponent.prototype.displayDetails = function (spellKey, spellData) {
    this.castButton.element.off('click');
    this.castButton.element.on('click', () => {
        this.handleCast(spellKey);
    });

    this.detailsNameEntity.element.text = spellData.name;
    this.detailsCostEntity.element.text = spellData.stamina;
    this.detailsDescriptionEntity.element.text = spellData.description;
}

SpellbookPanelComponent.prototype.clearPanel = function () {
    while (this.spellListContainer.children.length > 0) {
        this.spellListContainer.element.off('click');
        this.spellListContainer.children[0].destroy();
    }
}

SpellbookPanelComponent.prototype.handleCast = function (spellKey) {
    this.entity.fire('click:cast', spellKey);
}

SpellbookPanelComponent.prototype.handleClose = function (evt) {
    this.entity.enabled = false;
}
