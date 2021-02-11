export const DialoguePanelComponent = pc.createScript('DialoguePanelComponent');
import { Facade } from '@koreez/pure-mvc';
import { GameFacade } from '../../GameFacade';
import { DialoguePanelMediator } from './DialoguePanelMediator';

DialoguePanelComponent.attributes.add('scrollbarViewEntity', { type: 'entity', title: 'Scrollbar View' });
DialoguePanelComponent.attributes.add('contentEntity', { type: 'entity', title: 'Content Entity' });
DialoguePanelComponent.attributes.add('feedEntity', { type: 'entity', title: 'Feed Entity' });
DialoguePanelComponent.attributes.add('contentHeight', { type: 'number', title: 'Content Height', default: 520 });

DialoguePanelComponent.attributes.add('textEntryTemplate', { type: 'asset', title: 'Text Entry Asset' });
DialoguePanelComponent.attributes.add('choiceEntryTemplate', { type: 'asset', title: 'Choice Entry Asset' });
DialoguePanelComponent.attributes.add('skillTestEntryTemplate', { type: 'asset', title: 'Skill Test Entry Asset' });

DialoguePanelComponent.attributes.add('continueButtonEntity', { type: 'entity', title: 'Continue Button' });


// initialize code called once per entity
DialoguePanelComponent.prototype.initialize = function () {
    this.facade = Facade.getInstance(GameFacade.KEY);
    if (this.facade.hasMediator(DialoguePanelMediator.NAME)) {
        this.facade.removeMediator(DialoguePanelMediator.NAME);
    }

    this.facade.registerMediator(new DialoguePanelMediator(this.entity));

    this.entity.enabled = false;

    this.choices = [];

    this.continueButtonEntity.element.on('click', () => {
        this.entity.fire('clicked:continue');
    }, this);

};

DialoguePanelComponent.prototype.createStep = function (stepData) {
    this.createText(stepData.step);

    if (stepData.step.choices) {
        for (let i = 0; i < stepData.step.choices.length; i++) {
            const choice = stepData.step.choices[i];
            this.createChoice(i, choice.text);
        }
    }
}

DialoguePanelComponent.prototype.createText = function (stepData) {
    const newText = this.textEntryTemplate.resource.instantiate();
    newText.script["DialogueTextComponent"].setup(stepData);
    this.feedEntity.addChild(newText);
    this.resizeToContents();

    setTimeout(() => {
        this.scrollbarViewEntity.scrollbar.value = 1;
    }, 50);
}

DialoguePanelComponent.prototype.createChoice = function (index, text) {
    const newChoice = this.choiceEntryTemplate.resource.instantiate();
    newChoice.script["DialogueChoiceComponent"].setup(index, text);
    newChoice.element.text = text;
    this.feedEntity.addChild(newChoice);
    this.choices.push(newChoice);

    newChoice.on('click', this.handleSelectChoice, this);

    this.resizeToContents();

    setTimeout(() => {
        this.scrollbarViewEntity.scrollbar.value = 1;
    }, 50);
}

DialoguePanelComponent.prototype.createSkillTest = function (skillName, skillValue, die1, die2, wasSuccess) {
    const newSkillTest = this.skillTestEntryTemplate.resource.instantiate();
    newSkillTest.script["DialogueSkillTestComponent"].setup(skillName, skillValue, die1, die2, wasSuccess);
    this.feedEntity.addChild(newSkillTest);

    this.resizeToContents();

    setTimeout(() => {
        this.scrollbarViewEntity.scrollbar.value = 1;
    }, 50);
}

DialoguePanelComponent.prototype.clearDialogueChoices = function () {
    for (const choice of this.choices) {
        choice.off('click', this.handleSelectChoice, this);
        choice.destroy();
    }

    this.choices = [];
}

DialoguePanelComponent.prototype.clearPanel = function () {
    while (this.feedEntity.children.length > 0) {
        this.feedEntity.children[0].destroy();
    }
}

DialoguePanelComponent.prototype.handleSelectChoice = function (index) {
    this.entity.fire('clicked:choice', index);
}

DialoguePanelComponent.prototype.resizeToContents = function () {
    let spacingVertical = this.feedEntity.layoutgroup.spacing.y;
    let height = 0;

    for (const feedChild of this.feedEntity.children) {
        height += feedChild.element.height;
        height += spacingVertical;
    }

    this.contentEntity.element.height = Math.max(this.contentHeight, height);
}

DialoguePanelComponent.prototype.setContinueButton = function (value) {
    this.continueButtonEntity.enabled = value;
}
