const { Proxy } = require('@koreez/pure-mvc');
import { Astar } from './navigation/Astar';
const { GameMapVO } = require('./GameMapVO');

export class GameMapProxy extends Proxy {
    get vo() {
        return this.getData();
    }
    static get NAME() { return "GameMapProxy" };

    constructor(mapGrid) {
        super(GameMapProxy.NAME);

        this.setData({
            mapGrid: mapGrid
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
}
