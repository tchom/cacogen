<template>
  <div
    id="story-node"
    class="container border rounded overflow-hidden shadow-sm position-relative story-node-container"
  >
    <div class="row">
      <div class="col">
        <h3>{{ id }}</h3>
      </div>
      <div class="col-6 float-end" v-if="editing">
        <button @click="toggleCollapse" class="btn float-end">-</button>
        <button @click="addStoryStep" class="btn float-end">Add Step</button>
        <button @click="deleteStoryNode" class="btn float-end">
          Delete node
        </button>
      </div>
      <div v-else class="col">
        <button @click="toggleCollapse" class="btn float-end">+</button>
      </div>
    </div>

    <div v-if="editing" class="row">
      <story-node-step
        v-for="(storyStep, index) in stepList"
        :key="index"
        :stepData="storyStep"
        @delete:step="deleteStep"
      />
    </div>
  </div>
</template>

<script>
import StoryNodeStep from "./StoryNodeStep.vue";

export default {
  name: "story-node",
  components: {
    StoryNodeStep,
  },
  data() {
    return {
      stepList: this.storyData.steps,
      editing: false,
    };
  },
  props: {
    id: String,
    storyData: Object,
  },
  methods: {
    toggleCollapse() {
      this.editing = !this.editing;
    },
    addStoryStep() {
      if (this.storyData.steps === undefined) {
        this.storyData.steps = [];
      }
      const newStepData = {
        text: "",
      };
      this.storyData.steps.push(newStepData);
      this.stepList = this.storyData.steps;
    },
    deleteStoryNode() {
      this.$emit("delete:node", this.id);
    },
    deleteStep(id) {
      const deleteIndex = this.storyData.steps.findIndex(
        (step) => step.id === id
      );

      this.storyData.steps.splice(deleteIndex, 1);
    },
  },
  watch: {
    storyData: {
      deep: true,
      handler(newValue) {
        this.stepList = newValue.steps;
      },
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

.story-node-container {
  margin-bottom: 10px;
}
</style>
