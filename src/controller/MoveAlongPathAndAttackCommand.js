const { Facade } = require('@koreez/pure-mvc');
import { GameCommands } from './GameCommands';
import { GameCharacterMediator } from '../view/gameCharacter/GameCharacterMediator';
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';

export function moveAlongPathAndAttackCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    const characterId = args[0];
    const targetId = args[1];
    const path = args[2];

    const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
    characterProxy.useMovement(path.length - 1);
    const characterMediator = facade.retrieveMediator(GameCharacterMediator.NAME + characterId);
    facade.sendNotification(GameCommands.HIDE_WALKABLE_AREA);

    const finishMovePromise = characterMediator.handleNavigateAlongPathWithPromise(path);
    finishMovePromise.then(() => {
        facade.sendNotification(GameCommands.RESOLVE_ATTACK, characterId, targetId);

    });
}