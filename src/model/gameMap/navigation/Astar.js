import { PriorityQueue } from './PriorityQueue';

export class Astar {
    static breadthFirstSearch(start, rangeLimit) {
        let frontier = [];
        const searchedArea = [];
        frontier.push(start);

        const cameFrom = new Map();
        cameFrom.set(start, start);

        let range = 0;

        while (frontier.length > 0 && range < rangeLimit) {
            const newFrontier = [];
            for (const current of frontier) {
                for (let i = 0; i < current.connectedNodes.length; i++) {
                    const next = current.connectedNodes[i];
                    // const distValue = this.getDistSquared(next, current);

                    if (!next.occupied && (!cameFrom.has(next))) {
                        newFrontier.push(next);
                        searchedArea.push(next);
                        cameFrom.set(next, current);
                    }
                }
            }

            frontier = newFrontier;

            range++;
        }

        return searchedArea;
    }


    static calculatePath(start, goal) {
        const frontier = new PriorityQueue();
        frontier.push(start, 0);

        const cameFrom = new Map();
        const costSoFar = new Map();

        cameFrom.set(start, start);
        costSoFar.set(start, 0);

        while (!frontier.empty()) {
            const current = frontier.pop();

            if (current.equals(goal)) {
                break;
            }

            for (let i = 0; i < current.connectedNodes.length; i++) {
                const next = current.connectedNodes[i];
                // const distValue = this.getDistSquared(next, current);
                const newCost = costSoFar.get(current) + 1;

                if (!next.occupied && (!costSoFar.has(next) || newCost < costSoFar.get(next))) {
                    costSoFar.set(next, newCost);
                    let priority = newCost + this.heuristic(next, goal);
                    frontier.push(next, priority);
                    cameFrom.set(next, current);
                }
            }

        }

        let current = goal;
        let pathIsBroken = false;
        const path = [];
        path.push(current);

        while (!current.equals(start) && !pathIsBroken) {
            if (cameFrom.has(current) || !current.equals(goal)) {
                current = cameFrom.get(current);
                path.push(current);
            } else {
                pathIsBroken = true;
            }
        }

        if (pathIsBroken) {
            return undefined;
        } else {
            //path.push(start);
            // path.reverse();
            return path;
        }
    }

    static calculateWaypointsPath(start, goal) {
        const frontier = new PriorityQueue();
        frontier.push(start, 0);

        const cameFrom = new Map();
        const costSoFar = new Map();

        cameFrom.set(start, start);
        costSoFar.set(start, 0);

        while (!frontier.empty()) {
            const current = frontier.pop();

            if (current.equals(goal)) {
                break;
            }

            for (let i = 0; i < current.connectedNodes.length; i++) {
                const next = current.connectedNodes[i];
                const distValue = this.getDistSquared(next, current);
                const newCost = costSoFar.get(current) + distValue;

                if (!next.occupied && (!costSoFar.has(next) || newCost < costSoFar.get(next))) {
                    costSoFar.set(next, newCost);
                    let priority = newCost + this.heuristic(next, goal);
                    frontier.push(next, priority);
                    cameFrom.set(next, current);
                }
            }

        }

        let current = goal;
        let pathIsBroken = false;
        const path = [];
        path.push(current);

        while (!current.equals(start) && !pathIsBroken) {
            if (cameFrom.has(current) || !current.equals(goal)) {
                current = cameFrom.get(current);
                path.push(current);
            } else {
                pathIsBroken = true;
            }
        }

        if (pathIsBroken) {
            return undefined;
        } else {
            //path.push(start);
            // path.reverse();
            return path;
        }
    }

    static getDistSquared(pt1, pt2) {
        return ((pt1.x - pt2.x) * (pt1.x - pt2.x)
            + (pt1.y - pt2.y) * (pt1.y - pt2.y)
            + (pt1.z - pt2.z) * (pt1.z - pt2.z));
    }

    static heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
    }

    static calculateBresenhamLine(x0, z0, x1, z1) {
        let dx = x1 - x0;
        let dy = z1 - z0;
        let nx = Math.abs(dx);
        let ny = Math.abs(dy);

        const sign_x = dx > 0 ? 1 : -1;
        const sign_y = dy > 0 ? 1 : -1;


        const p = { x: x0, y: 0, z: z0 };
        const points = [];

        for (let ix = 0, iy = 0; ix < nx || iy < ny;) {
            if ((0.5 + ix) / nx < (0.5 + iy) / ny) {
                // next step is horizontal
                p.x += sign_x;
                ix++;
            } else {
                // next step is vertical
                p.z += sign_y;
                iy++;
            }
            points.push({ x: p.x, y: 0, z: p.z });
        }

        return points;

    }

    static checkValidLine(line, map) {
        let isValidLine = true;
        for (const point of line) {
            if (!map.some(n => n.equals(point))) {
                isValidLine = false;
            }
        }

        return isValidLine;
    }
}