import { NavigationNode } from "../../model/gameMap/navigation/NavigationNode";

export const NavigationComponent = pc.createScript('NavigationComponent');

NavigationComponent.attributes.add("connectedComponents", {
    type: "entity",
    array: true,
    title: "Connected Components"
});

NavigationComponent.prototype.initialize = function () {

}

/**
 * @param {Array<NavigationNode>} nodeGrid - Array of nodes representing points on the grid.
 */
NavigationComponent.prototype.setGrid = function (nodeGrid) {
    this.nodeGrid = nodeGrid;
}

NavigationComponent.prototype.getGrid = function () {
    return this.nodeGrid;
}