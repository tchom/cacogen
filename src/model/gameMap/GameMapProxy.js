const { Proxy } = require('@koreez/pure-mvc');
import { Astar } from './navigation/Astar';
import { getAdjacentPoints } from '../../utils/AdjacentPoints';
const { GameMapVO } = require('./GameMapVO');

export class GameMapProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "GameMapProxy" };

    constructor(mapGrid, wallBoundingBoxes, cover, portals) {
        super(GameMapProxy.NAME);

        this.setData({
            mapGrid: mapGrid,
            wallBoundingBoxes: wallBoundingBoxes,
            cover: cover,
            portals: portals
        });
    }

    onRegister() {

    }

    findNearestNode(targetPoint) {
        const mapGrid = this.vo.mapGrid;

        let nearestNode = mapGrid[0];
        let distSqrtToNearestNode = Astar.getDistSquared(nearestNode, targetPoint);
        for (const node of mapGrid) {
            const distToNode = Astar.getDistSquared(node, targetPoint);

            if (distToNode < distSqrtToNearestNode) {
                distSqrtToNearestNode = distToNode;
                nearestNode = node;
            }
        }

        return nearestNode;
    }

    rayIntersectsWall(from, to) {
        const distance = from.distance(to);
        const direction = to.clone().sub(from.clone()).normalize();
        const ray = new pc.Ray(from, direction);

        const mapWalls = this.vo.wallBoundingBoxes;
        for (const wall of mapWalls) {
            const hitPosition = new pc.Vec3();
            const result = wall.intersectsRay(ray, hitPosition);
            if (result) {
                const distanceToHit = hitPosition.distance(from);

                if (distanceToHit < distance) {
                    return true;
                }
            }
        }

        return false;
    }

    get cover() {
        return this.vo.cover;
    }


    isInCover(targetPoint, attackingFrom) {
        const adjacentCoverPoints = [];
        const adjacentPoints = getAdjacentPoints(targetPoint);

        for (const adjacentPoint of adjacentPoints) {
            const matchingNode = this.cover.find((coverPoint) => adjacentPoint.equals(coverPoint));
            if (matchingNode) {
                adjacentCoverPoints.push(adjacentPoint);
            }
        }

        if (adjacentCoverPoints.length > 0) {
            const distanceToTarget = targetPoint.distance(attackingFrom);
            for (const adjacentCoverPoint of adjacentCoverPoints) {
                const distanceToCover = adjacentCoverPoint.distance(attackingFrom);
                if (distanceToCover < distanceToTarget) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }

    retrievePortal(portalId) {
        return this.vo.portals.get(portalId);
    }
}
