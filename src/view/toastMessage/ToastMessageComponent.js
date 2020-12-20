import { Facade } from "@koreez/pure-mvc";
import { GameFacade } from "../../GameFacade";
import { ToastMessageMediator } from "./ToastMessageMediator";

export const ToastMessageComponent = pc.createScript('ToastMessageComponent');

ToastMessageComponent.attributes.add('labelEntity', { type: 'entity', title: 'Label Entity' });
ToastMessageComponent.attributes.add('messageTime', { type: 'number', default: 5, title: 'Message Time' });

// initialize code called once per entity
ToastMessageComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(ToastMessageMediator.NAME)) {
        this.facade.removeMediator(ToastMessageMediator.NAME);
    }

    this.messageQueue = [];
    this.currentTimeout = undefined;

    this.facade.registerMediator(new ToastMessageMediator(this.entity));
};

ToastMessageComponent.prototype.addMessage = function (message) {
    if (this.messageQueue.length === 0) {
        this.messageQueue.push(message);
        this.showNextMessage();
    } else {
        this.messageQueue.push(message);
    }
}


ToastMessageComponent.prototype.showNextMessage = function () {
    if (this.messageQueue.length > 0) {
        const nextMessage = this.messageQueue[0];

        this.labelEntity.element.text = nextMessage;

        setTimeout(() => {
            this.messageQueue.shift();
            this.showNextMessage();
        }, this.messageTime * 1000);
    } else {
        this.labelEntity.element.text = "";

    }
}