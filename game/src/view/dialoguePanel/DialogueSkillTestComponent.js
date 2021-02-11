export const DialogueSkillTestComponent = pc.createScript('DialogueSkillTestComponent');

DialogueSkillTestComponent.attributes.add('skillNameLabel', { type: 'entity', title: 'Skill Name Label' });
DialogueSkillTestComponent.attributes.add('skillValueLabel', { type: 'entity', title: 'Skill Value Label' });
DialogueSkillTestComponent.attributes.add('die1Label', { type: 'entity', title: 'Die 1 Label' });
DialogueSkillTestComponent.attributes.add('die2Label', { type: 'entity', title: 'Die 2 Label' });
DialogueSkillTestComponent.attributes.add('successLabel', { type: 'entity', title: 'Success Label' });
DialogueSkillTestComponent.attributes.add('failureLabel', { type: 'entity', title: 'Failure Label' });



// initialize code called once per entity
DialogueSkillTestComponent.prototype.initialize = function () {

}

DialogueSkillTestComponent.prototype.setup = function (skillName, skillValue, die1, die2, wasSuccess) {
    this.skillNameLabel.element.text = skillName;
    this.skillValueLabel.element.text = skillValue;
    this.die1Label.element.text = die1;
    this.die2Label.element.text = die2;
    this.successLabel.enabled = wasSuccess;
    this.failureLabel.enabled = !wasSuccess;
}
