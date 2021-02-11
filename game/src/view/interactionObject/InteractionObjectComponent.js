import { Facade } from "@koreez/pure-mvc";
import { GameFacade } from "../../GameFacade";
import { InteractionObjectMediator } from "./InteractionObjectMediator";

export const InteractionObjectComponent = pc.createScript('InteractionObjectComponent');

InteractionObjectComponent.attributes.add('id', { type: 'string', title: 'Id' });
InteractionObjectComponent.attributes.add('dialogueTreeId', { type: 'string', title: 'Dialogue Tree Id' });
InteractionObjectComponent.attributes.add('standingPoint', { type: 'entity', title: 'Standing Point' });


// initialize code called once per entity
InteractionObjectComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(InteractionObjectMediator.NAME)) {
        this.facade.removeMediator(InteractionObjectMediator.NAME);
    }

    this.facade.registerMediator(new InteractionObjectMediator(this.entity));

    this.standingPoint.enabled = false;
};