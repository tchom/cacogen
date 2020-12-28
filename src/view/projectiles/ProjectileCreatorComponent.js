import { Facade } from "@koreez/pure-mvc";
import { GameFacade } from "../../GameFacade";
import { ProjectileCreatorMediator } from "./ProjectileCreatorMediator";

export const ProjectileCreatorComponent = pc.createScript('ProjectileCreatorComponent');

const projectileSchema = [
    {
        name: 'projectileName',
        title: 'Projectile Name',
        type: 'string'
    },
    {
        name: 'projectileTemplate',
        title: 'Projectile Template',
        type: 'asset'
    }
];

ProjectileCreatorComponent.attributes.add("projectileTypes", {
    type: "json",
    title: "Projectile Types",
    schema: projectileSchema,
    array: true
});
// initialize code called once per entity
ProjectileCreatorComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(ProjectileCreatorMediator.NAME)) {
        this.facade.removeMediator(ProjectileCreatorMediator.NAME);
    }
    this.facade.registerMediator(new ProjectileCreatorMediator(this.entity));
};


ProjectileCreatorComponent.prototype.createProjectile = function (projectileName, originPoint, targetPoint) {
    return new Promise((resolve, reject) => {

        const projectileScheme = this.projectileTypes.find(scheme => scheme.projectileName === projectileName);
        if (projectileScheme) {
            const newProjectile = projectileScheme.projectileTemplate.resource.instantiate();
            this.entity.addChild(newProjectile);
            newProjectile.once('projectileArrived', () => {
                resolve();
            });
            newProjectile.script['ProjectileComponent'].setTarget(originPoint, targetPoint);

        } else {
            reject();
            throw new Error(`Unable to create projectile "${projectileName}"`);
        }
    });
}