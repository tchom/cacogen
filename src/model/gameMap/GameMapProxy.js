const { Proxy } = require('@koreez/pure-mvc');
import { Astar } from './navigation/Astar';
const { GameMapVO } = require('./GameMapVO');

export class GameMapProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "GameMapProxy" };

    constructor(mapGrid, wallBoundingBoxes) {
        super(GameMapProxy.NAME);

        this.setData({
            mapGrid: mapGrid,
            wallBoundingBoxes: wallBoundingBoxes
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

        console.log('Ray cast');
        console.log(direction);

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
}
