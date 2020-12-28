const { Facade } = require('@koreez/pure-mvc');
import { GameCharacterProxy } from '../model/gameCharacter/GameCharacterProxy';

export function equipWeaponCommand(multitonKey, notificationName, ...args) {
    const facade = Facade.getInstance(multitonKey);
    console.log(args);

    const characterId = args[0];
    const weapon = args[1];

    const characterProxy = facade.retrieveProxy(GameCharacterProxy.NAME + characterId);
    characterProxy.equippedWeapon = weapon;
}