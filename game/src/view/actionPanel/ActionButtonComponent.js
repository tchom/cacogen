export const ActionButtonComponent = pc.createScript('ActionButtonComponent');
import { Facade } from '@koreez/pure-mvc';

const commandSchema = [
    {
        name: 'commandName',
        title: 'Command name',
        type: 'string'
    },
    {
        name: 'commandArgs',
        title: 'Command arguments',
        type: 'string', array: true
    }
];

ActionButtonComponent.attributes.add('highlightEntity', { type: 'entity', title: 'Highlight Entity' });
ActionButtonComponent.attributes.add('iconEntity', { type: 'entity', title: 'Icon Entity' });
ActionButtonComponent.attributes.add('commands', { type: 'json', schema: commandSchema, title: 'Command name', array: true });;

// initialize code called once per entity
ActionButtonComponent.prototype.initialize = function () {
    this.highlightEntity.enabled = false;
    this.entity.on('select:action', this.handleChangeAction, this);
    this.entity.element.on('click', this.handleClick, this);
};

ActionButtonComponent.prototype.handleClick = function (evt) {
    for (const command of this.commands) {
        const commandName = command.commandName;
        const commandArgs = command.commandArgs;
        this.entity.parent.fire('click:fireCommand', commandName, ...commandArgs);

    }
}

ActionButtonComponent.prototype.handleChangeAction = function (action) {
    if (this.entity.name === action) {
        this.highlightEntity.enabled = !this.highlightEntity.enabled;

    } else {
        this.highlightEntity.enabled = false;
    }
}