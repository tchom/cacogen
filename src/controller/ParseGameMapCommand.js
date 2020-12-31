const { GameMediator } = require('../view/GameMediator');
import { NavigationNode } from '../model/gameMap/navigation/NavigationNode';
import { GameMapMediator } from '../view/gameMap/GameMapMediator';
import { GameMapProxy } from '../model/gameMap/GameMapProxy';
import { GameCommands } from './GameCommands';
const { Facade } = require('@koreez/pure-mvc');

export function parseGameMapCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    // Once a gameMap scene is loaded, parse gameMap VO, generate nav mesh, etc
    // Get navigation floors
    const app = pc.Application.getApplication();
    const floorGrid = createMapFloor(app);
    const walls = createMapWalls(app, floorGrid);
    const cover = createMapCover(app, floorGrid);


    // Register mediators

    if (facade.hasProxy(GameMapProxy.NAME)) {
        // remove old map
        facade.removeProxy(GameMapProxy.NAME)
    }

    facade.registerProxy(new GameMapProxy(floorGrid, walls, cover));
    console.log('MAP_GRID_CREATED');
    facade.sendNotification(GameCommands.MAP_GRID_CREATED);
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

function createMapWalls(app, floorGrid) {
    const wallsBoundingBoxes = [];
    const mapWallEntities = app.root.findByTag('wall');
    for (const mapWallEntity of mapWallEntities) {
        const aabb = createBoundingBoxFromEntity(mapWallEntity);
        wallsBoundingBoxes.push(aabb);
        createFloorUnderWalls(mapWallEntity, floorGrid);
        mapWallEntity.destroy();
    }

    return wallsBoundingBoxes;

}

function createBoundingBoxFromEntity(boxEntity) {
    const scale = boxEntity.getLocalScale();
    const halfExtents = new pc.Vec3(scale.x / 2, scale.y / 2, scale.z / 2);
    const aabb = new pc.BoundingBox(boxEntity.getPosition(), halfExtents);
    return aabb;
}

function createFloorUnderWalls(wall, floorGrid) {
    const wallPos = wall.getPosition();
    const wallScale = wall.getLocalScale();
    const y = Math.round(wallPos.y - (wallScale.y * 0.5));

    const cornerX = Math.round(wallPos.x - (wallScale.x * 0.5));
    const cornerZ = Math.round(wallPos.z - (wallScale.z * 0.5));

    for (let x = cornerX; x < cornerX + wallScale.x; x++) {
        for (let z = cornerZ; z < cornerZ + wallScale.z; z++) {
            const matchingNodeIndex = floorGrid.findIndex((node) => node.equalsPoint(x, y, z));
            if (matchingNodeIndex > -1) {
                const deletedNodes = floorGrid.splice(matchingNodeIndex, 1);

                for (const deletedNode of deletedNodes) {
                    for (const node of deletedNode.connectedNodes) {
                        node.disconnectedNode(deletedNode);
                    }
                }
            }

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

function createMapCover(app, floorGrid) {
    let coverPoints = [];
    const coverEntities = app.root.findByTag('cover');
    for (const coverEntity of coverEntities) {
        coverPoints = coverPoints.concat(createCoverPointFromBox(coverEntity, floorGrid));
        coverEntity.destroy();
    }

    return coverPoints;

}

function createCoverPointFromBox(box, floorGrid) {
    const coverPoints = [];
    const boxPos = box.getPosition();
    const boxScale = box.getLocalScale();
    const y = Math.round(boxPos.y - (boxScale.y * 0.5));

    const cornerX = Math.round(boxPos.x - (boxScale.x * 0.5));
    const cornerZ = Math.round(boxPos.z - (boxScale.z * 0.5));

    for (let x = cornerX; x < cornerX + boxScale.x; x++) {
        for (let z = cornerZ; z < cornerZ + boxScale.z; z++) {
            const coverPoint = new pc.Vec3(x, y, z);
            coverPoints.push(coverPoint);
            const matchingNodeIndex = floorGrid.findIndex((node) => node.equalsPoint(x, y, z));
            if (matchingNodeIndex > -1) {
                const deletedNodes = floorGrid.splice(matchingNodeIndex, 1);

                for (const deletedNode of deletedNodes) {
                    for (const node of deletedNode.connectedNodes) {
                        node.disconnectedNode(deletedNode);
                    }
                }
            }

        }

    }

    return coverPoints;

}