import { Facade } from "@koreez/pure-mvc";

export function hideWalkableAreaCommand(multitonKey, notificationName, ...args) {
    const app = pc.Application.getApplication();
    const walkableTileEntities = app.root.findByTag('walkable_tile');
    for (const walkableTileEntity of walkableTileEntities) {
        walkableTileEntity.destroy();
    }
}
