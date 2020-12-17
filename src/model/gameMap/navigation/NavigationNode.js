export class NavigationNode {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.connectedNodes = [];
    }

    isConnected(otherNode) {
        return this.connectedNodes.find(node => node.x === otherNode.x
            && node.y === otherNode.y && node.z === otherNode.z) !== undefined;
    }

    equals(otherNode) {
        return this.x === otherNode.x && this.y === otherNode.y && this.z === otherNode.z;
    }

    equalsPoint(x, y, z) {
        return this.x === x && this.y === y && this.z === z;
    }

    addConnectedNode(otherNode) {
        if (!this.isConnected(otherNode)) {
            this.connectedNodes.push(otherNode);
        }
    }

    disconnectedNode(otherNode) {
        const connectedNodeIndex = this.connectedNodes.findIndex(node => node.equals(otherNode));
        this.connectedNodes.splice(connectedNodeIndex, 1);
    }
}