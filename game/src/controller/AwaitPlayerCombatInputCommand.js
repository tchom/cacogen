import { Facade } from "@koreez/pure-mvc";
import { Astar } from "../model/gameMap/navigation/Astar";
import { GameCommands } from './GameCommands';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';

export function awaitPlayerCombatInputCommand(multitonKey, notificationName, ...args) {
    const characterId = args[0];
    const facade = Facade.getInstance(multitonKey);

    const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
    const vo = characterProxy.vo;
    const moveableNodes = Astar.breadthFirstSearch(vo.currentNode, vo.availableMovement);

    facade.sendNotification(GameCommands.SHOW_WALKABLE_AREA, moveableNodes);

}
