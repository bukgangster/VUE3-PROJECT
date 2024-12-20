<template>
  <div class="container">
    <h2>To-do List</h2>

    <input
      type="text"
      class="form-control"
      v-model="searchText"
      placeholder="Search"
    />
    <hr />

    <TodoSimpleForm @add-todo="addTodo" />
    <div>{{ error }}</div>

    <div v-if="!filteredTodos.length">There is nothing to display.</div>
    <TodoList
      :todos="filteredTodos"
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"
    />
  </div>
</template>

<script>
import axios from "axios";

import { ref, computed } from "vue";
import TodoSimpleForm from "./components/TodoSimpleForm.vue";
import TodoList from "./components/TodoList.vue";

export default {
  components: {
    TodoSimpleForm,
    TodoList,
  },
  setup() {
    const todos = ref([]);
    const error = ref("");

    const addTodo = (todo) => {
      error.value = "";
      axios
        .post("http://localhost:3000/todos", {
          subject: todo.subject,
          completed: false,
        })
        .then((res) => {
          console.log(res);
          todos.value.push(res.data);
        })
        .catch((err) => {
          console.log(err);
          error.value = "Somthing Error";
        });
    };

    const deleteTodo = (index) => {
      todos.value.splice(index, 1);
    };

    const toggleTodo = (index) => {
      console.log(index);
      todos.value[index].completed = !todos.value[index].completed;
    };

    const searchText = ref("");
    const filteredTodos = computed(() => {
      if (searchText.value) {
        return todos.value.filter((todo) => {
          return todo.subject.includes(searchText.value);
        });
      }
      return todos.value;
    });

    return {
      todos,
      searchText,
      error,

      addTodo,
      deleteTodo,
      toggleTodo,
      filteredTodos,
    };
  },
};
</script>

<style>
.todo {
  color: gray;
  text-decoration: line-through;
}
</style>
