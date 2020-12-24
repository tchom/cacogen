import { Facade } from "@koreez/pure-mvc";
import { GameFacade } from "../../GameFacade";
import { PlayerCombatPanelMediator } from "./PlayerCombatPanelMediator";

export const PlayerCombatPanelComponent = pc.createScript('PlayerCombatPanelComponent');

PlayerCombatPanelComponent.attributes.add('endTurnButton', { type: 'entity', title: 'End Turn button' });

// initialize code called once per entity
PlayerCombatPanelComponent.prototype.initialize = function () {

};

PlayerCombatPanelComponent.prototype.initialize = function () {

    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(PlayerCombatPanelMediator.NAME)) {
        this.facade.removeMediator(PlayerCombatPanelMediator.NAME);
    }

    this.messageQueue = [];
    this.currentTimeout = undefined;

    this.facade.registerMediator(new PlayerCombatPanelMediator(this.entity));

    this.endTurnButton.element.on('click', this.clickEndTurn, this);
};

PlayerCombatPanelComponent.prototype.clickEndTurn = function (evt) {
    this.entity.fire('click:endTurn');
}
