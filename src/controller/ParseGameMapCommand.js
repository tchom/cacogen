const { GameMediator } = require('../view/GameMediator');
import { NavigationNode } from '../model/gameMap/navigation/NavigationNode';
import { Astar } from '../model/gameMap/navigation/Astar';
const { Facade } = require('@koreez/pure-mvc');

export function parseGameMapCommand(multitonKey, notificationName) {
    // Once a gameMap scene is loaded, parse gameMap VO, generate nav mesh, etc
    console.log('Parse map');

    // Get navigation floors
    const app = pc.Application.getApplication();
    const navigationFloors = app.root.findByTag('navigation_floor');
    const waypointTemplate = app.root.findByName("Waypoint");
    console.log("****");
    console.log(waypointTemplate);

    for (const floorEntity of navigationFloors) {
        const floorGrid = createPartialGridFromFloor(floorEntity)
        console.log(floorGrid);
        const firstNode = floorGrid[0];
        const lastNode = floorGrid[floorGrid.length - 1];
        const path = Astar.calculatePath(firstNode, lastNode);
        console.log("****");
        console.log(path);
        for (const pathPoint of path) {
            const point = waypointTemplate.clone();
            point.enabled = true;
            point.setLocalPosition(pathPoint.x, pathPoint.y, pathPoint.z);
        }
    }
}

function createPartialGridFromFloor(floorEntity) {
    // snap to grid
    const grid = [];

    const floorPosition = floorEntity.getLocalPosition();
    const floorSize = floorEntity.getLocalScale();

    const snappedWidth = Math.round(floorSize.x);
    const snappedBreadth = Math.round(floorSize.z);

    const snappedX = Math.round(floorPosition.x - (snappedWidth / 2));
    const snappedY = floorPosition.y;
    const snappedZ = Math.round(floorPosition.z - (snappedBreadth / 2));



    for (let z = snappedZ; z < snappedZ + snappedBreadth; z++) {
        for (let x = snappedX; x < snappedX + snappedWidth; x++) {
            const node = new NavigationNode(x, snappedY, z);
            grid.push(node);
        }
    }

    // Connect neighbours
    for (const node of grid) {
        for (const otherNode of grid) {
            if (otherNode.equalsPoint(node.x - 1, node.y, node.z) ||
                otherNode.equalsPoint(node.x + 1, node.y, node.z) ||
                otherNode.equalsPoint(node.x, node.y, node.z - 1) ||
                otherNode.equalsPoint(node.x, node.y, node.z + 1)) {
                node.addConnectedNode(otherNode);
            }
        }
    }

    return grid;
}