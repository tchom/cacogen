export const FXTimeoutComponent = pc.createScript('FXTimeoutComponent');


FXTimeoutComponent.attributes.add("timeout", {
    type: "number",
    title: "Timeout (seconds)",
    default: 1,
});
// initialize code called once per entity
FXTimeoutComponent.prototype.initialize = function () {
    setTimeout(() => {
        this.entity.destroy();
    }, this.timeout * 1000);
};
