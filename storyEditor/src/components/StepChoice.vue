<template>
  <div id="step-choice">
    <!-- controls -->
    <div class="row">
      <div class="col-2"><b>Is test?</b></div>
      <div class="col">
        <input class="form-check-input" type="checkbox" v-model="isTest" />
      </div>
      <div class="col">
        <button @click="deleteChoice" class="button float-end" type="checkbox">
          Delete
        </button>
      </div>
    </div>
    <div v-if="isTest">
      <div class="row">
        <div class="col-2"><b>Text:</b></div>
        <div class="col">
          <textarea type="text" v-model="choiceData.text" />
        </div>
      </div>
      <!-- skill -->
      <div class="row">
        <div class="col-2"><b>Skill:</b></div>
        <div class="col">
          <input type="text" v-model="skill" />
        </div>
      </div>
      <!-- success -->
      <div class="row">
        <div class="col-2"><b>Sucess:</b></div>
        <div class="col">
          <input type="text" v-model="success" />
        </div>
      </div>

      <!-- failure -->
      <div class="row">
        <div class="col-2"><b>Failure:</b></div>
        <div class="col">
          <input type="text" v-model="failure" />
        </div>
      </div>
    </div>

    <div v-else>
      <div class="row">
        <div class="col-2"><b>Text:</b></div>
        <div class="col">
          <textarea type="text" v-model="choiceData.text" />
        </div>
      </div>
      <div class="row">
        <div class="col-2"><b>goto:</b></div>
        <div class="col">
          <input type="text" v-model="choiceData.goto" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "step-choice",
  data() {
    return {
      isTest: this.choiceData.test !== undefined,
      skill: this.choiceData.test ? this.choiceData.test.skill : "",
      success:
        this.choiceData.test && this.choiceData.test.success
          ? this.choiceData.test.success.goto
          : "",
      failure:
        this.choiceData.test && this.choiceData.test.failure
          ? this.choiceData.test.failure.goto
          : "",
    };
  },
  props: {
    choiceIndex: Number,
    choiceData: Object,
  },

  methods: {
    toggleCollapse() {
      this.editing = !this.editing;
    },

    createBlankTest() {
      this.choiceData.test = {
        skill: "",
        success: {
          goto: "",
        },
        failure: {
          goto: "",
        },
      };
    },
    sanitizeTest(oldTest) {
      const newTest = {};
      newTest.skill = oldTest.skill ?? "";
      newTest.success = oldTest.success ?? { goto: "" };
      newTest.failure = oldTest.failure ?? { goto: "" };

      this.choiceData.test = newTest;
    },
    deleteChoice() {
      console.log("DELETE CHOICE...");
      console.log(this.choiceIndex);
      this.$emit("delete:choice", this.choiceIndex);
    },
  },
  watch: {
    skill: {
      deep: true,
      handler: function (newValue) {
        if (this.choiceData.test === undefined) {
          this.createBlankTest();
        } else {
          this.sanitizeTest(this.choiceData.test);
        }
        this.choiceData.test.skill = newValue;
      },
    },
    success: {
      deep: true,
      handler: function (newValue) {
        if (this.choiceData.test === undefined) {
          this.createBlankTest();
        } else {
          this.sanitizeTest(this.choiceData.test);
        }
        this.choiceData.test.success.goto = newValue;
      },
    },
    failure: {
      deep: true,
      handler: function (newValue) {
        if (this.choiceData.test === undefined) {
          this.createBlankTest();
        } else {
          this.sanitizeTest(this.choiceData.test);
        }
        this.choiceData.test.failure.goto = newValue;
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
</style>
