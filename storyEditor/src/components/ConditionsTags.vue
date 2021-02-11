<template>
  <div class="conditions-tags">
    <div v-for="tag in tags" :key="tag" class="tag-input__tag">
      <span @click="removeTag(index)">x</span>
      {{ tag }}
    </div>
    <input
      type="text"
      placeholder="Enter a Tag"
      class="tag-input__text form-control"
      @keydown.enter="addTag"
      @keydown.188="addTag"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      tags: this.conditions,
    };
  },
  props: {
    conditions: Array,
  },
  methods: {
    addTag(event) {
      event.preventDefault();
      var val = event.target.value.trim();
      if (val.length > 0) {
        this.tags.push(val);
        event.target.value = "";
      }

      this.conditions = this.tags;
    },
    removeTag(index) {
      this.tags.splice(index, 1);
      this.conditions = this.tags;
    },
  },
};
</script>
<style scoped>
.tag-input {
  width: 100%;
  border: 1px solid #eee;
  font-size: 0.9em;
  height: 50px;
  box-sizing: border-box;
  padding: 0 10px;
}

.tag-input__tag {
  height: 30px;
  float: left;
  margin-right: 10px;
  background-color: #eee;
  margin-top: 10px;
  line-height: 30px;
  padding: 0 5px;
  border-radius: 5px;
}

.tag-input__tag > span {
  cursor: pointer;
  opacity: 0.75;
}

.tag-input__text {
  border: none;
  outline: none;
  font-size: 0.9em;
  line-height: 50px;
  background: none;
}
</style>