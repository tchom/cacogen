export const PlayerCharacterComponent = pc.createScript('PlayerCharacterComponent');

// initialize code called once per entity
PlayerCharacterComponent.prototype.initialize = function () {

};


PlayerCharacterComponent.prototype.moveAlongPath = function (path) {

    const moveAlongPath = (path) => {
        if (path.length > 0) {
            setTimeout(() => {
                const nextNode = path.pop();
                this.entity.setLocalPosition(nextNode.x, nextNode.y, nextNode.z);
                moveAlongPath(path);
            }, 300);
        }
    };

    moveAlongPath(path);

};