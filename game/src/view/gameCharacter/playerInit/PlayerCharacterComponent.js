export const PlayerCharacterComponent = pc.createScript('PlayerCharacterComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameCommands } from '../../../controller/GameCommands';
import { GameFacade } from '../../../GameFacade';


// initialize code called once per entity
PlayerCharacterComponent.prototype.initialize = function () {
    this.entity.on('created:gameCharacter', () => {

        const facade = Facade.getInstance(GameFacade.KEY);
        facade.sendNotification(GameCommands.ADD_ITEM_TO_INVENTORY, "player", "sword");
        facade.sendNotification(GameCommands.ADD_ITEM_TO_INVENTORY, "player", "pistolet");
        facade.sendNotification(GameCommands.ADD_ITEM_TO_INVENTORY, "player", "fusil");
        facade.sendNotification(GameCommands.ADD_ITEM_TO_INVENTORY, "player", "chainmail");
        facade.sendNotification(GameCommands.ADD_ITEM_TO_INVENTORY, "player", "shield");
        facade.sendNotification(GameCommands.EQUIP_ITEM_TO_SLOT, "player", "unarmed", "1hand");
        facade.sendNotification(GameCommands.EQUIP_ITEM_TO_SLOT, "player", "unarmed", "2hand");
    })
};
