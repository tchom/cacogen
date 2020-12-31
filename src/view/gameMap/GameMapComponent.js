export const GameMapComponent = pc.createScript('GameMapComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../GameFacade';
import { GameMapMediator } from './GameMapMediator';

// initialize code called once per entity
GameMapComponent.prototype.postInitialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(GameMapMediator.NAME)) {
        this.facade.removeMediator(GameMapMediator.NAME);
    }

    this.facade.registerMediator(new GameMapMediator(this.entity));
}