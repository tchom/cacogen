import { Facade } from '@koreez/pure-mvc';
import { GameCommands } from './GameCommands';
import { GameStateProxy } from '../model/gameState/GameStateProxy';

export function handleWorldInputCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const pickedEntity = args[0];
    const hitPosition = args[1];

    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);

    switch (gameStateProxy.currentAction) {

        case "cast_spell":
            handleCastSpell(facade, gameStateProxy.selectedSpellCommand, pickedEntity, hitPosition);
            break;
        case "attack":
        default:
            handleDefault(facade, pickedEntity, hitPosition);
            break;
    }
}

function handleCastSpell(facade, spellCommand, pickedEntity, hitPosition) {
    if (facade.hasCommand(spellCommand)) {
        facade.sendNotification(spellCommand, pickedEntity, hitPosition);
    } else {
        console.log(`No registered command:: ${spellCommand}`);
    }

    const gameStateProxy = facade.retrieveProxy(GameStateProxy.NAME);
    gameStateProxy.currentAction = "interact";


}

function handleDefault(facade, pickedEntity, hitPosition) {
    if (pickedEntity.tags.has('gameCharacter')) {
        handleGameCharacter(facade, pickedEntity, hitPosition);
    }

    if (pickedEntity.tags.has('navigation')) {
        handleNavigation(facade, pickedEntity, hitPosition);
    }
}

function handleGameCharacter(facade, pickedEntity, hitPosition) {
    facade.sendNotification(GameCommands.SELECT_GAME_CHARACTER, pickedEntity);
}

function handleNavigation(facade, pickedEntity, hitPosition) {
    const navComp = pickedEntity.script['NavigationComponent'];
    const nearestNode = navComp.getNearestNode(hitPosition);
    facade.sendNotification(GameCommands.SELECTED_NODE, nearestNode);
}