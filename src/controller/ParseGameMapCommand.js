const { GameMediator } = require('../view/GameMediator');
import { NavigationNode } from '../model/gameMap/navigation/NavigationNode';
import { GameMapMediator } from '../view/gameMap/GameMapMediator';
import { GameMapProxy } from '../model/gameMap/GameMapProxy';
import { GameCommands } from './GameCommands';
const { Facade } = require('@koreez/pure-mvc');

export function parseGameMapCommand(multitonKey, notificationName) {
    // Once a gameMap scene is loaded, parse gameMap VO, generate nav mesh, etc

    // Get navigation floors
    const app = pc.Application.getApplication();
    const floorGrid = createMapFloor(app);
    const walls = createMapWalls(app);

    // Register mediators
    Facade.getInstance(multitonKey).registerProxy(new GameMapProxy(floorGrid, walls));
    Facade.getInstance(multitonKey).registerMediator(new GameMapMediator());

    Facade.getInstance(multitonKey).sendNotification(GameCommands.MAP_GRID_CREATED);

}

function createMapFloor(app) {
    const navigationFloors = app.root.findByTag('navigation_floor');

    let completedGrid = [];

    const navigationComponents = [];
    // First parse - create nodes and connections for individual 
    // navigation components
    for (const floorEntity of navigationFloors) {
        const navComp = floorEntity.script['NavigationComponent'];
        navigationComponents.push(navComp);

        const floorGrid = createPartialGridFromFloor(floorEntity)
        navComp.setGrid(floorGrid);
    }

    // Second parse - stitch together adjacent nodes in 
    // connected navigation meshes
    for (const navigationComp of navigationComponents) {
        for (const connectedCompEntity of navigationComp.connectedComponents) {
            const connectedNavComp = connectedCompEntity.script['NavigationComponent'];

            joinToAdjacentGrid(navigationComp.getGrid(), connectedNavComp.getGrid());
            completedGrid = completedGrid.concat(navigationComp.getGrid());
        }
    }

    return completedGrid;
}

function createMapWalls(app) {
    const wallsBoundingBoxes = [];
    const mapFloorEntities = app.root.findByTag('wall');
    for (const mapFloorEntity of mapFloorEntities) {
        const aabb = createBoundingBoxFromEntity(mapFloorEntity);
        wallsBoundingBoxes.push(aabb);
        mapFloorEntity.destroy();
    }

    return wallsBoundingBoxes;

}

function createBoundingBoxFromEntity(boxEntity) {
    const scale = boxEntity.getLocalScale();
    const halfExtents = new pc.Vec3(scale.x / 2, scale.y / 2, scale.z / 2);
    const aabb = new pc.BoundingBox(boxEntity.getPosition(), halfExtents);
    return aabb;
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

function joinToAdjacentGrid(grid, gridToJoin) {
    // Connect neighbours
    for (const node of grid) {
        for (const otherNode of gridToJoin) {
            if (otherNode.equalsPoint(node.x - 1, node.y, node.z) ||
                otherNode.equalsPoint(node.x + 1, node.y, node.z) ||
                otherNode.equalsPoint(node.x, node.y, node.z - 1) ||
                otherNode.equalsPoint(node.x, node.y, node.z + 1)) {
                node.addConnectedNode(otherNode);
            }
        }
    }
}