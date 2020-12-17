const { Facade } = require('@koreez/pure-mvc');
import { GameCommand } from './GameCommand';

export function changeSceneCommand(multitonKey, notificationName, ...args) {
    const app = pc.Application.getApplication();
    const sceneName = args[0];
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
        Facade.getInstance(multitonKey).sendNotification(GameCommand.CHANGE_SCENE_COMPLETE, sceneName);

    });
}