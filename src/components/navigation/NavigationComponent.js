export const NavigationComponent = pc.createScript('NavigationComponent');

NavigationComponent.attributes.add("connectedComponents", {
    type: "entity",
    array: true,
    title: "Connected Components"
});

NavigationComponent.prototype.initialize = function () {

}