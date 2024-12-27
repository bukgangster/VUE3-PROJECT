<template>
  <h1>Create Todo</h1>
  <TodoForm />
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
