<template>
  <div id="story-table">
    <p v-if="storyTrees.length < 1" class="empty-table">No story trees</p>
    <table v-else>
      <thead>
        <tr>
          <th>id</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="storyTree.id" v-for="storyTree in storyTrees">
          <td>{{ storyTree.id }}</td>

          <td>{{ storyTree.name }}</td>
          <td>
            <button @click="$emit('edit:storyTree', storyTree.id)">Edit</button>
            <button @click="$emit('delete:storyTree', storyTree.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "storyTree-table",
  props: {
    storyTrees: Array,
  },
  data() {
    return {
      editing: null,
    };
  },
  methods: {
    editMode(id) {
      this.editing = id;
    },

    /*editEmployee(employee) {
      if (employee.name === "" || employee.email === "") return;
      this.$emit("edit:employee", employee.id, employee);
      this.editing = null;
    },*/
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
