<template>
  <h1>To-do Page</h1>
  <TodoForm :editing="true" />
</template>

<script>
import TodoForm from "@/composables/TodoForm.vue";

export default {
  components: {
    TodoForm,
  },
  setup() {
    return {};
  },
};
</script>

<style></style>
