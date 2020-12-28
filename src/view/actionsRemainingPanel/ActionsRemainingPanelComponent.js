export const ActionsRemainingPanelComponent = pc.createScript('ActionsRemainingPanelComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../GameFacade';
import { ActionsRemainingPanelMediator } from './ActionsRemainingPanelMediator';

ActionsRemainingPanelComponent.attributes.add('pipTemplate', { type: 'asset', title: 'Pip Template' });

// initialize code called once per entity
ActionsRemainingPanelComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(ActionsRemainingPanelMediator.NAME)) {
        this.facade.removeMediator(ActionsRemainingPanelMediator.NAME);
    }

    this.facade.registerMediator(new ActionsRemainingPanelMediator(this.entity));

    this.pips = [];
}

ActionsRemainingPanelComponent.prototype.showAvailableAction = function (availableActions, maxActions) {
    while (this.pips.length < maxActions) {
        this.createPip();
    }

    for (let i = 0; i < this.pips.length; i++) {
        if (i < availableActions) {
            this.pips[i].fire('togglePip', true);
        } else {
            this.pips[i].fire('togglePip', false);
        }
    }
}


ActionsRemainingPanelComponent.prototype.createPip = function () {
    const newPip = this.pipTemplate.resource.instantiate();
    this.entity.addChild(newPip);
    this.pips.push(newPip);
}
