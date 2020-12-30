export const FloatingStatusCreatorComponent = pc.createScript('FloatingStatusCreatorComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../GameFacade';
import { FloatingStatusCreatorMediator } from './FloatingStatusCreatorMediator';
import { TemporaryFloatingStatusComponent } from './components/TemporaryFloatingStatusComponent';

const floatingStatusSchema = [
    {
        name: 'name',
        title: 'Name',
        type: 'string'
    },
    {
        name: 'template',
        title: 'Template',
        type: 'asset'
    }
];

FloatingStatusCreatorComponent.attributes.add('screenEntity', { type: 'entity', title: 'Screen Entity' });
FloatingStatusCreatorComponent.attributes.add('cameraEntity', { type: 'entity', title: 'Camera Entity' });
FloatingStatusCreatorComponent.attributes.add('floatingStatuses', { type: 'json', schema: floatingStatusSchema, title: 'Floating Statuses', array: true });

// initialize code called once per entity
FloatingStatusCreatorComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(FloatingStatusCreatorMediator.NAME)) {
        this.facade.removeMediator(FloatingStatusCreatorMediator.NAME);
    }

    this.facade.registerMediator(new FloatingStatusCreatorMediator(this.entity));

};

FloatingStatusCreatorComponent.prototype.displayStatus = function (name, targetProxy, ...args) {
    const scheme = this.floatingStatuses.find((otherScheme) => otherScheme.name === name);
    if (scheme) {
        // 
        const targetNode = targetProxy.currentNode;
        const targetPos = new pc.Vec3(targetNode.x, targetNode.y + targetProxy.height, targetNode.z);
        const newStatus = scheme.template.resource.instantiate();
        newStatus.script['TemporaryFloatingStatusComponent'].setWorldPosition(targetPos,
            this.cameraEntity, this.screenEntity);
        this.entity.addChild(newStatus);

    } else {
        throw new Error(`Cannot create floating status: ${name}`);
    }

}
