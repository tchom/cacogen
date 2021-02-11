<template>
  <div id="create-story-node-form">
    <form @submit.prevent="handleSubmit">
      <label>New Story Node</label>
      <input
        ref="first"
        type="text"
        :class="{ 'has-error': submitting && invalidName }"
        v-model="storyNode.name"
        @focus="clearStatus"
        @keypress="clearStatus"
      />
      <p v-if="error && submitting" class="error-message">
        ❗Please fill out name
      </p>
      <p v-if="success" class="success-message">
        ✅ Story Node successfully added
      </p>
      <button>Add node</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "create-story-node-form",
  data() {
    return {
      error: false,
      submitting: false,
      success: false,
      storyNode: {
        name: "",
      },
    };
  },
  computed: {
    invalidName() {
      return this.storyNode.name === "";
    },
  },
  methods: {
    handleSubmit() {
      this.clearStatus();
      this.submitting = true;

      if (this.invalidName) {
        this.error = true;
        return;
      }

      this.$emit("add:storyNode", this.storyTree);
      this.$refs.first.focus();
      this.storyNode = {
        name: "",
      };
      this.clearStatus();
      this.submitting = false;
    },

    clearStatus() {
      this.success = false;
      this.error = false;
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
