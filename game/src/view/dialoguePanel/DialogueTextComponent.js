export const DialogueTextComponent = pc.createScript('DialogueTextComponent');

DialogueTextComponent.attributes.add('withImageWidth', { type: 'number', title: 'With Image Width', default: 340 });
DialogueTextComponent.attributes.add('withoutImageWidth', { type: 'number', title: 'With Image Width', default: 360 });

DialogueTextComponent.attributes.add('textContainer', { type: 'entity', title: 'Text Container' });
DialogueTextComponent.attributes.add('titleEntity', { type: 'entity', title: 'Title Entity' });
DialogueTextComponent.attributes.add('bodyEntity', { type: 'entity', title: 'Body Entity' });

DialogueTextComponent.attributes.add('thumbnailContainer', { type: 'entity', title: 'Thumbnail Container' });
DialogueTextComponent.attributes.add('thumbnailImage', { type: 'entity', title: 'Thumbnail Image' });


// initialize code called once per entity
DialogueTextComponent.prototype.initialize = function () {

}

DialogueTextComponent.prototype.setup = function (stepData) {
    if (stepData.title) {
        this.titleEntity.element.text = stepData.title;

        if (stepData.titleColour) {
            this.titleEntity.element.color.fromString(stepData.titleColour);

        }
    } else {
        this.titleEntity.enabled = false;
    }

    if (stepData.thumbnail) {
        this.textContainer.element.width = this.withImageWidth;
    } else {
        this.textContainer.element.width = this.withoutImageWidth;
        this.thumbnailContainer.enable = false;
    }

    this.bodyEntity.element.text = stepData.text;
    // this.entity.element.height = this.labelEntity.element.height;
}

DialogueTextComponent.prototype.setHeight = function () {
    const minHeight = (this.thumbnailContainer.enable) ? this.thumbnailContainer.element.height : 0;
    let height = 0;
    let spacing = this.textContainer.layoutgroup.spacing.y;
    for (const textChild of this.textContainer.children) {
        height += textChild.element.height + spacing;
    }


    if (!this.titleEntity.enabled) {
        this.bodyEntity.element.width = this.withImageWidth;

    }

    this.entity.element.height = Math.max(minHeight, height);

}

DialogueTextComponent.prototype.postInitialize = function () {
    this.setHeight();

}

DialogueTextComponent.prototype.update = function (dt) {
    //this.entity.element.height = this.labelEntity.element.height;

}
