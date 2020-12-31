const { Facade } = require('@koreez/pure-mvc');
const { PureMVC } = require('@koreez/pure-mvc');
import { GameFacade } from './GameFacade';
import { CacogenGame } from './view/CacogenGame';

import { NavigationComponent } from './components/navigation/NavigationComponent';
import { GameCharacterComponent } from './view/gameCharacter/GameCharacterComponent';
import { AgroGameCharacterComponent } from './view/gameCharacter/aggro/AgroGameCharacterComponent';
import { ToastMessageComponent } from './view/toastMessage/ToastMessageComponent';
import { SetCameraTargetComponent } from './view/gameCharacter/setCameraTarget/SetCameraTargetComponent';
import { PlayerCombatPanelComponent } from './view/playerCombatPanel/PlayerCombatPanelComponent';
import { HitboxComponent } from './components/collision/HitboxComponent';
import { ActionPanelComponent } from './view/actionPanel/ActionPanelComponent';
import { UIStopPropagation } from './components/UIStopPropagation';
import { ProjectileCreatorComponent } from './view/projectiles/ProjectileCreatorComponent';
import { ProjectileComponent } from './view/projectiles/ProjectileComponent';
import { StaminaBarComponent } from './view/staminaBar/StaminaBarComponent';
import { ActionsRemainingPanelComponent } from './view/actionsRemainingPanel/ActionsRemainingPanelComponent';
import { ActionsRemainingPipComponent } from './view/actionsRemainingPanel/ActionsRemainingPipComponent';
import { FloatingStatusCreatorComponent } from './view/floatingStatus/FloatingStatusCreatorComponent';
import { PortalComponent } from './view/portal/PortalComponent';

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