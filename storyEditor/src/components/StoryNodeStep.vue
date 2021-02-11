<template>
  <div id="story-node-step" class="story-node-container">
    <div v-if="editing">
      <!-- controls -->
      <div class="row">
        <div class="col">
          <button @click="toggleCollapse" class="btn float-end">-</button>
          <button @click="deleteStep" class="btn float-end">Delete step</button>
        </div>
      </div>
      <!-- title -->
      <div class="row">
        <div class="col-2"><b>Title:</b></div>
        <div class="col-9">
          <input type="text" v-model="stepData.title" />
        </div>
      </div>
      <!-- text -->
      <div class="row">
        <div class="col-2"><b>Text:</b></div>
        <div class="col-9">
          <textarea type="text" v-model="stepData.text" />
        </div>
      </div>
      <!-- once -->
      <div class="row">
        <div class="col-2"><b>Once:</b></div>
        <div class="col">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="stepData.once"
          />
        </div>
      </div>
      <!-- Choices -->
      <step-choice-list :stepData="stepData" />
      <!-- conditions -->
      <div class="row">
        <div class="col-2"><b>Conditions:</b></div>
        <div class="col-9">
          <conditions-tags :conditions="stepData.conditions" />
        </div>
      </div>
      <!-- notifications -->
      <div class="row">
        <div class="col-2"><b>Notifications:</b></div>
        <div class="col-9">
          <button @click="addNotification" class="btn float-end">
            Add Notification
          </button>
        </div>
      </div>
      <div v-for="(notificationData, index) in notifications" :key="index">
        <div class="row">
          <div class="col-2"><b>Name:</b></div>
          <div class="col-8">
            <input type="text" v-model="notificationData.name" />
          </div>
          <div class="col">
            <button
              :data-label="index"
              @click="deleteNotification"
              class="btn float-end"
            >
              Delete
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-2"><b>Args:</b></div>
          <div class="col-9">
            <conditions-tags :conditions="notificationData.args" />
          </div>
          <hr />
        </div>
      </div>

      <!--<label>text</label>
        <textarea ref="first" type="text" v-model="stepData.text" />-->
    </div>

    <div v-else>
      <!-- controls -->
      <div class="row">
        <div class="col">
          <button @click="toggleCollapse" class="btn float-end">+</button>
        </div>
      </div>
      <!-- title -->
      <div class="row">
        <div class="col"><b>Title:</b> {{ stepData.title }}</div>
      </div>
      <!-- text -->
      <div class="row">
        <div class="col"><b>Text:</b> {{ stepData.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import StepChoiceList from "./StepChoiceList.vue";
import ConditionsTags from "./ConditionsTags.vue";

export default {
  name: "story-node-step",
  components: {
    StepChoiceList,
    ConditionsTags,
  },

  data() {
    return {
      notifications: this.stepData.notiications ?? [],
      editing: false,
    };
  },
  beforeMount() {
    if (this.stepData.conditions === undefined) {
      this.stepData.conditions = [];
    }
    if (this.stepData.notifications === undefined) {
      this.stepData.notifications = [];
    }
  },
  props: {
    stepData: Object,
  },

  methods: {
    toggleCollapse() {
      this.editing = !this.editing;
    },
    addNotification() {
      this.notifications.push({
        name: "",
        args: [],
      });
      this.stepData.notifications = this.notifications;
    },

    deleteNotification(index) {
      this.notifications.splice(index, 1);
    },
    deleteStep() {
      this.$emit("delete:step");
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

.story-node-container:nth-child(even) {
  background-color: #fff;
}

.story-node-container:nth-child(odd) {
  background-color: rgb(253, 253, 222);
  padding: 10px;
}
</style>
