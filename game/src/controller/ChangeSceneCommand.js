const { Facade } = require('@koreez/pure-mvc');
import { GameCommands } from './GameCommands';

export function changeSceneCommand(multitonKey, notificationName, ...args) {
    const app = pc.Application.getApplication();
    const sceneName = args[0];
    const portalId = args[1];
    console.log(`Changing scene ${sceneName}`);

    // Get a reference to the scene's root object
    const oldHierarchy = app.root.findByName('Root');

    // Get the path to the scene
    const scene = app.scenes.find(sceneName);

    // Load the scenes entity hierarchy
    app.scenes.loadSceneHierarchy(scene.url, function (err, parent) {
        if (!err) {
            if (oldHierarchy) {
                oldHierarchy.destroy();
            }
        } else {
            console.error(err);
        }
        Facade.getInstance(multitonKey).sendNotification(GameCommands.CHANGE_SCENE_COMPLETE, sceneName);
        Facade.getInstance(multitonKey).sendNotification(GameCommands.PARSE_GAMEMAP, sceneName);
        Facade.getInstance(multitonKey).sendNotification(GameCommands.ADD_PLAYER_CHARACTER_TO_MAP, portalId);

    });
}