<template>
  <div id="create-story-form">
    <form @submit.prevent="handleSubmit">
      <label>New Story</label>
      <input
        ref="first"
        type="text"
        :class="{ 'has-error': submitting && invalidName }"
        v-model="storyTree.name"
        @focus="clearStatus"
        @keypress="clearStatus"
      />
      <p v-if="error && submitting" class="error-message">
        ❗Please fill out name
      </p>
      <p v-if="success" class="success-message">
        ✅ Employee successfully added
      </p>
      <button>Add story</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "create-story-form",
  data() {
    return {
      error: false,
      submitting: false,
      success: false,
      storyTree: {
        name: "",
      },
    };
  },
  computed: {
    invalidName() {
      return this.storyTree.name === "";
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

      this.$emit("add:storyTree", this.storyTree);
      this.$refs.first.focus();
      this.storyTree = {
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
