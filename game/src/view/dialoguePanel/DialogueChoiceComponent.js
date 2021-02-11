export const DialogueChoiceComponent = pc.createScript('DialogueChoiceComponent');

DialogueChoiceComponent.attributes.add('indexEntity', { type: 'entity', title: 'Index Entity' });
DialogueChoiceComponent.attributes.add('labelEntity', { type: 'entity', title: 'Label Entity' });


// initialize code called once per entity
DialogueChoiceComponent.prototype.initialize = function () {

}

DialogueChoiceComponent.prototype.setup = function (index, label) {
    this.indexEntity.element.text = (index + 1) + ".";
    this.labelEntity.element.text = label;

    this.entity.element.height = this.labelEntity.element.height;

    this.entity.element.on('click', () => {
        this.entity.fire('click', index)
    });
}

DialogueChoiceComponent.prototype.update = function (dt) {
    this.entity.element.height = this.labelEntity.element.height;

}
