<template>
  <div id="app" class="small-container">
    <div v-if="isEditing === true">
      <h1>Edit Story: {{ currentStoryId }}</h1>

      <story-node-table :story="currentStoryId" @save:story="saveStory" />
    </div>
    <div v-else>
      <h1>Story Nodes</h1>
      <create-story-form @add:storyTree="addStoryTree" />
      <story-table
        :storyTrees="storyTrees"
        @edit:storyTree="editStoryTree"
        @create:storyTree="createStoryTree"
        @delete:storyTree="deleteStoryTree"
      />
    </div>
  </div>
</template>

<script>
import StoryTable from "@/components/StoryTable.vue";
import CreateStoryForm from "@/components/CreateStoryForm.vue";
import StoryNodeTable from "./components/StoryNodeTable.vue";

export default {
  name: "app",
  components: {
    StoryTable,
    CreateStoryForm,
    StoryNodeTable,
  },
  data() {
    return {
      isEditing: false,
      currentStoryId: null,
      storyTrees: [],
    };
  },

  mounted() {
    this.getStoryTrees();
  },
  methods: {
    async getStoryTrees() {
      try {
        const response = await fetch("//localhost:3000/storylist");
        const data = await response.json();
        console.log("*****");
        console.log(data);
        this.storyTrees = data.list;
      } catch (error) {
        console.error(error);
      }
    },
    async createStoryTree(storyTitle) {
      try {
        const response = await fetch("//localhost:3000/createStory", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ storyName: storyTitle }),
        });
        console.log("Response");
        console.log(response);
        this.getStoryTrees();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteStoryTree(storyTitle) {
      try {
        await fetch("//localhost:3000/deleteStory", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ storyName: storyTitle }),
        });
        this.getStoryTrees();
      } catch (error) {
        console.error(error);
      }
    },
    addStoryTree(storyTreeData) {
      /*const lastId =
        this.employees.length > 0
          ? this.employees[this.employees.length - 1].id
          : 0;
      const id = lastId + 1;
      const newEmployee = { ...employee, id };

      this.employees = [...this.employees, newEmployee];*/
      this.createStoryTree(storyTreeData.name);
    },

    editStoryTree(id) {
      this.isEditing = true;
      this.currentStoryId = id;
    },

    async saveStory(storyId, storyNodes) {
      console.log("******");
      console.log(storyId);
      try {
        await fetch("//localhost:3000/saveStory", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: storyId,
            data: storyNodes,
          }),
        });
        this.getStoryTrees();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
button {
  background: #009435;
  border: 1px solid #009435;
}

button:hover,
button:active,
button:focus {
  background: #32a95d;
  border: 1px solid #32a95d;
}

.small-container {
  max-width: 680px;
}
</style>
