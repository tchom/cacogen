export const ActionPanelComponent = pc.createScript('ActionPanelComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../GameFacade';
import { ActionPanelMediator } from './ActionPanelMediator';
import { ActionButtonComponent } from './ActionButtonComponent';

ActionPanelComponent.attributes.add('actionButtons', { type: 'entity', title: 'Action Buttons', array: true });

// initialize code called once per entity
ActionPanelComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(ActionPanelMediator.NAME)) {
        this.facade.removeMediator(ActionPanelMediator.NAME);
    }

    this.facade.registerMediator(new ActionPanelMediator(this.entity));
}

ActionPanelComponent.prototype.selectAction = function (actionName) {
    for (const button of this.actionButtons) {
        button.fire('select:action', actionName);
    }
}
