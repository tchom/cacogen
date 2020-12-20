const { Facade } = require('@koreez/pure-mvc');
const { PureMVC } = require('@koreez/pure-mvc');
import { GameFacade } from './GameFacade';
import { CacogenGame } from './view/CacogenGame';

import { NavigationComponent } from './components/navigation/NavigationComponent';
import { GameCharacterComponent } from './view/gameCharacter/GameCharacterComponent';
import { AgroGameCharacterComponent } from './view/gameCharacter/aggro/AgroGameCharacterComponent';
import { ToastMessageComponent } from './view/toastMessage/ToastMessageComponent';
import { NavigateToNodeComponent } from './view/gameCharacter/navigateToNode/NavigateToNodeComponent';
import { SetCameraTargetComponent } from './view/gameCharacter/setCameraTarget/SetCameraTargetComponent';


class Main {
    constructor() {
        console.log("Main start");
        PureMVC.debug = true;
        Facade.getInstance = GameFacade.getInstance;
        console.log(Facade);

        this.facade = Facade.getInstance(GameFacade.KEY);
        this.facade.startup(this);
    }
}

const main = new Main();