export const DefaultAnimationComponent = pc.createScript('DefaultAnimationComponent');

DefaultAnimationComponent.attributes.add("animationName", {
    type: "string",
    title: "Animation Name"
});

// initialize code called once per entity
DefaultAnimationComponent.prototype.postInitialize = function () {
    this.entity.animation.loop = true;
    this.entity.animation.play(this.animationName, 0.1);
}