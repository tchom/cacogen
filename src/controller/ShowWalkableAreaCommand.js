export function showWalkableAreaCommand(multitonKey, notificationName, ...args) {
    const walkableNodes = args[0];
    const app = pc.Application.getApplication();
    const walkableTileAsset = app.assets.get(40235966);
    const container = app.root.findByName("WorldObjects");

    for (const node of walkableNodes) {
        const tile = walkableTileAsset.resource.instantiate();
        tile.setLocalPosition(node.x, node.y, node.z);
        container.addChild(tile);
    }

}
