<template>
  <div id="story-node-table">
    <button @click="saveStory" class="btn">Save</button>

    <form @submit.prevent="handleSubmit">
      <label>New Story Node</label>
      <input
        ref="first"
        type="text"
        :class="{ 'has-error': submitting && invalidName }"
        v-model="newStoryNode.id"
        @focus="clearStatus"
        @keypress="clearStatus"
      />
      <p v-if="error && submitting" class="error-message">
        ❗Sory must have an id
      </p>
      <p v-if="success" class="success-message">
        ✅ Story Node successfully added
      </p>
      <button class="btn">Add node</button>
    </form>
    <h2>edit: {{ story }}</h2>

    <p v-if="storyNodes.length < 1" class="empty-table">No story nodes</p>
    <div v-else>
      <story-node
        v-for="storyNodeData in storyNodes"
        :key="storyNodeData.id"
        :id="storyNodeData.id"
        :storyData="storyNodeData.data"
        @delete:node="deleteStoryNode"
      />
      <!--<div v-for="storyNodeData in storyNodes" :key="storyNodeData.id">
        <h2>{{ storyNodeData.id }}</h2>
        <p>{{ storyNodeData.data }}</p>
      </div>-->
    </div>
  </div>
</template>

<script>
import StoryNode from "@/components/StoryNode.vue";

export default {
  name: "storyNode-table",
  components: {
    StoryNode,
  },
  props: {
    story: String,
  },
  data() {
    return {
      error: false,
      submitting: false,
      success: false,
      newStoryNode: {
        id: "",
      },
      storyNodes: [],
    };
  },
  mounted: function () {
    console.log(this.story);
    this.getStoryData(this.story);
  },
  computed: {
    invalidName() {
      return this.newStoryNode.id === "";
    },
  },
  methods: {
    async getStoryData(storyId) {
      try {
        const response = await fetch(
          `//localhost:3000/storyNode?storyId=${storyId}`
        );
        const data = await response.json();
        const parsedData = [];
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            parsedData.push({
              id: key,
              data: data[key],
            });
          }
        }
        this.storyNodes = parsedData;

        console.log(this.storyNodes);
      } catch (error) {
        console.error(error);
      }
    },
    handleSubmit() {
      this.clearStatus();
      this.submitting = true;

      if (this.invalidName) {
        this.error = true;
        return;
      }

      const newNode = this.createStoryNode(this.newStoryNode.id);
      this.storyNodes.push(newNode);

      this.$emit("add:storyNode", this.storyTree);
      this.$refs.first.focus();
      this.newStoryNode = {
        id: "",
      };
      this.clearStatus();
      this.submitting = false;
    },
    clearStatus() {
      this.success = false;
      this.error = false;
    },
    createStoryNode(nodeId) {
      return {
        id: nodeId,
        data: {},
      };
    },
    saveStory() {
      console.log("Before.");
      this.$emit("save:story", this.story, this.storyNodes);
      console.log("After.");
    },
    deleteStoryNode(id) {
      const nodeIndex = this.storyNodes.findIndex((node) => node.id === id);
      this.storyNodes.splice(nodeIndex, 1);
    },
  },
};
</script>

<style scoped>
button {
  margin: 0 0.5rem 0 0;
}

input {
  margin: 0;
}

.empty-table {
  text-align: center;
}
</style>
