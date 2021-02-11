import { Facade } from "@koreez/pure-mvc";
import { GameFacade } from "../../GameFacade";
import { FXCreatorMediator } from "./FXCreatorMediator";

export const FXCreatorComponent = pc.createScript('FXCreatorComponent');

const fxSchema = [
    {
        name: 'fxName',
        title: 'FX Name',
        type: 'string'
    },
    {
        name: 'fxTemplate',
        title: 'FX Template',
        type: 'asset'
    }
];

FXCreatorComponent.attributes.add("fxTypes", {
    type: "json",
    title: "FX Types",
    schema: fxSchema,
    array: true
});
// initialize code called once per entity
FXCreatorComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(FXCreatorMediator.NAME)) {
        this.facade.removeMediator(FXCreatorMediator.NAME);
    }
    this.facade.registerMediator(new FXCreatorMediator(this.entity));
};


FXCreatorComponent.prototype.createFX = function (fxName, position) {
    return new Promise((resolve, reject) => {

        const fxScheme = this.fxTypes.find(scheme => scheme.fxName === fxName);
        if (fxScheme) {
            const newFX = fxScheme.fxTemplate.resource.instantiate();
            this.entity.addChild(newFX);
            newFX.setLocalPosition(position);

        } else {
            reject();
            throw new Error(`Unable to create FX "${fxName}"`);
        }
    });
}