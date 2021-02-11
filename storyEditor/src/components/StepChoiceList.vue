<template>
  <div id="step-choice-list">
    <!-- controls -->
    <div class="row">
      <div class="col-2"><b>Choices?:</b></div>
      <div class="col">
        <input class="form-check-input" type="checkbox" v-model="hasChoices" />
      </div>
      <div v-if="hasChoices" class="col">
        <button @click="addChoice" class="btn float-end">AddChoice</button>
      </div>
    </div>
    <!-- Choices list -->
    <div v-if="hasChoices">
      <step-choice
        v-for="(choiceData, index) in choices"
        :key="index"
        :choiceData="choiceData"
        :choiceIndex="index"
        class="choice-container"
        @delete:choice="deleteChoice"
      />
    </div>
  </div>
</template>

<script>
import StepChoice from "./StepChoice.vue";

export default {
  name: "step-choice-list",
  components: {
    StepChoice,
  },
  data() {
    return {
      choices: this.stepData.choices ?? [],
      hasChoices: this.stepData.choices
        ? this.stepData.choices.length > 0
        : false,
    };
  },
  props: {
    stepData: Object,
  },

  methods: {
    toggleCollapse() {
      this.editing = !this.editing;
    },
    addChoice() {
      if (this.stepData.choices === undefined) {
        this.stepData.choices = [];
      }
      const newChoiceData = {
        title: "",
        goto: "",
      };

      this.stepData.choices.push(newChoiceData);
      this.choices = this.stepData.choices;
    },
    deleteChoice(choiceIndex) {
      this.stepData.choices.splice(choiceIndex, 1);
      this.choices = this.stepData.choices;
    },
  },
};
</script>

<style scoped>
form {
  margin-bottom: 2rem;
}

[class*="-message"] {
  font-weight: 500;
}

.error-message {
  color: #d33c40;
}

.success-message {
  color: #32a95d;
}

.choice-container:nth-child(even) {
  background-color: rgb(216, 139, 67);
}

.choice-container:nth-child(odd) {
  background-color: rgb(200, 252, 105);
}
</style>
