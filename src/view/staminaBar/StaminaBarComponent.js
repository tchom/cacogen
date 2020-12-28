import { Facade } from "@koreez/pure-mvc";
import { GameFacade } from "../../GameFacade";
import { StaminaBarMediator } from "./StaminaBarMediator";

export const StaminaBarComponent = pc.createScript('StaminaBarComponent');

StaminaBarComponent.attributes.add("barEntity", {
    type: "entity",
    title: "Bar Entity"
});

StaminaBarComponent.attributes.add("staminaLabel", {
    type: "entity",
    title: "Stamina Label"
});

// initialize code called once per entity
StaminaBarComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(StaminaBarMediator.NAME)) {
        this.facade.removeMediator(StaminaBarMediator.NAME);
    }
    this.facade.registerMediator(new StaminaBarMediator(this.entity));

    this.barEntityMaxWidth = this.barEntity.element.width;
};


StaminaBarComponent.prototype.updateStamina = function (currentStamina, maxStamina) {
    const value = pc.math.clamp(currentStamina / maxStamina, 0, 1);
    const width = pc.math.lerp(0, this.barEntityMaxWidth, value);
    // set the width of the fill image element
    this.barEntity.element.width = width;

    // Set the width of the element's rect (rect.z) to be the same
    // value as our 0-1 progress.
    // This is so that the fill image will only show the portion
    // of the texture that is visible
    this.barEntity.element.rect.z = value;
    // force rect update
    this.barEntity.element.rect = this.barEntity.element.rect;

    this.staminaLabel.element.text = `${currentStamina}/${maxStamina}`;
}