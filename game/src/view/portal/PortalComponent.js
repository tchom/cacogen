export const PortalComponent = pc.createScript('PortalComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../GameFacade';
import { PortalMediator } from './PortalMediator';

PortalComponent.attributes.add('portalId', { type: 'string', title: 'Portal Id' });
PortalComponent.attributes.add('destinationScene', { type: 'string', title: 'Destination Scene' });
PortalComponent.attributes.add('destinationPortal', { type: 'string', title: 'Destination Portal' });
PortalComponent.attributes.add('hitbox', { type: 'entity', title: 'Hitbox' });
PortalComponent.attributes.add('standingPoint', { type: 'entity', title: 'Standing Point' });

// initialize code called once per entity
PortalComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(PortalMediator.NAME)) {
        this.facade.removeMediator(PortalMediator.NAME);
    }

    this.facade.registerMediator(new PortalMediator(this.entity));

    this.standingPoint.model.enabled = false;

};
