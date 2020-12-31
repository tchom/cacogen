const { Facade } = require('@koreez/pure-mvc');
import { GameMapProxy } from '../model/gameMap/GameMapProxy';

export function addPlayerCharacterToMapCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);

    const portalId = args[0];
    const app = pc.Application.getApplication();
    const playerCharacterAsset = app.assets.get(40523336);
    const container = app.root.findByName("WorldObjects");
    const playerEntity = playerCharacterAsset.resource.instantiate();
    container.addChild(playerEntity);

    const mapProxy = facade.retrieveProxy(GameMapProxy.NAME);
    const portal = mapProxy.retrievePortal(portalId);
    playerEntity.setLocalPosition(portal.standingPoint);


}