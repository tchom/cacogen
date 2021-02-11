import { NavigationNode } from "../../model/gameMap/navigation/NavigationNode";
import { Astar } from '../../model/gameMap/navigation/Astar';

export const NavigationComponent = pc.createScript('NavigationComponent');

NavigationComponent.attributes.add("connectedComponents", {
    type: "entity",
    array: true,
    title: "Connected Components"
});

NavigationComponent.prototype.initialize = function () {
    const scale = this.entity.getLocalScale();
    const halfExtents = new pc.Vec3(scale.x / 2, 0.05, scale.z / 2);
    this.aabb = new pc.BoundingBox(this.entity.getPosition(), halfExtents);
    this.app.on('picker:raycast', this.handleRayCast, this);

    this.entity.findByName('Plane').enabled = false;
    this.entity.once('destroy', () => {
        this.app.off('picker:raycast', this.handleRayCast, this);
    });
}

NavigationComponent.prototype.handleRayCast = function (ray, screenPos) {
    const hitPosition = new pc.Vec3();
    const result = this.aabb.intersectsRay(ray, hitPosition);
    if (result) {
        this.app.fire('picker:result', this.entity, hitPosition, screenPos);
    }
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

NavigationComponent.prototype.getNearestNode = function (targetPoint) {
    let nearestNode = this.nodeGrid[0];
    let distSqrtToNearestNode = Astar.getDistSquared(nearestNode, targetPoint);
    for (const node of this.nodeGrid) {
        const distToNode = Astar.getDistSquared(node, targetPoint);

        if (distToNode < distSqrtToNearestNode) {
            distSqrtToNearestNode = distToNode;
            nearestNode = node;
        }
    }
    return nearestNode;
}
