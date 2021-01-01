export const DialoguePanelComponent = pc.createScript('DialoguePanelComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../GameFacade';
import { DialoguePanelMediator } from './DialoguePanelMediator';

DialoguePanelComponent.attributes.add('scrollbarViewEntity', { type: 'entity', title: 'Scrollbar View' });
DialoguePanelComponent.attributes.add('contentEntity', { type: 'entity', title: 'Content Entity' });
DialoguePanelComponent.attributes.add('feedEntity', { type: 'entity', title: 'Feed Entity' });
DialoguePanelComponent.attributes.add('contentHeight', { type: 'number', title: 'Content Height', default: 520 });

DialoguePanelComponent.attributes.add('textEntryTemplate', { type: 'asset', title: 'Text Entry Asset' });

// initialize code called once per entity
DialoguePanelComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(DialoguePanelMediator.NAME)) {
        this.facade.removeMediator(DialoguePanelMediator.NAME);
    }

    this.facade.registerMediator(new DialoguePanelMediator(this.entity));

    this.entity.enabled = false;

};

DialoguePanelComponent.prototype.createText = function () {
    const newText = this.textEntryTemplate.resource.instantiate();
    newText.element.text = (this.feedEntity.children.length + 1) + ". " + newText.element.text;
    this.feedEntity.addChild(newText);
    this.resizeToContents();

    setTimeout(() => {
        this.scrollbarViewEntity.scrollbar.value = 1;
    }, 50);

}

DialoguePanelComponent.prototype.resizeToContents = function () {
    let spacingVertical = this.feedEntity.layoutgroup.spacing.y;
    let height = 0;

    for (const feedChild of this.feedEntity.children) {
        height += feedChild.element.height;
        height += spacingVertical;
    }

    this.contentEntity.element.height = Math.max(this.contentHeight, height);
}

DialoguePanelComponent.prototype.postInitialize = function () {

}
