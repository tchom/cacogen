export const ActionsRemainingPipComponent = pc.createScript('ActionsRemainingPipComponent');

ActionsRemainingPipComponent.attributes.add('pipFront', { type: 'entity', title: 'Pip front' });

// initialize code called once per entity
ActionsRemainingPipComponent.prototype.initialize = function () {
    this.entity.on('togglePip', (show) => {
        this.pipFront.enabled = show;
    });
}
