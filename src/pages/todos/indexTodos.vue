<template>
  <div>
    <h2>To-do List</h2>

    <input
      type="text"
      class="form-control"
      v-model="searchText"
      placeholder="Search"
      @keyup.enter="searchTodo"
    />
    <hr />

    <TodoSimpleForm @add-todo="addTodo" />
    <div>{{ error }}</div>

    <div v-if="!todos.length">There is nothing to display.</div>
    <TodoList
      :todos="todos"
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"
    />
  </div>
  <hr />

  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li v-if="currentPage !== 1">
        <a
          style="cursor: pointer"
          class="page-link"
          @click="getTodos(currentPage - 1)"
          >Previous
        </a>
      </li>
      <li
        v-for="page in numberOfPages"
        :key="page"
        class="page-item"
        :class="currentPage === page ? 'active' : ''"
      >
        <a style="cursor: pointer" class="page-link" @click="getTodos(page)">{{
          page
        }}</a>
      </li>
      <li v-if="numberOfPages !== currentPage" class="page-item">
        <a
          style="cursor: pointer"
          class="page-link"
          @click="getTodos(currentPage + 1)"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</template>

<script>
import axios from "axios";

import { ref, computed, watch } from "vue";
import TodoSimpleForm from "@/components/TodoSimpleForm.vue";
import TodoList from "@/components/TodoList.vue";

export default {
  components: {
    TodoSimpleForm,
    TodoList,
  },
  setup() {
    const todos = ref([]);
    const error = ref("");
    const searchText = ref("");

    const numberOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value / limit);
    });

    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;

      try {
        const res = await axios.get(
          `http://localhost:3000/todos?_sort=id&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`
        );
        todos.value = res.data;
        numberOfTodos.value = res.headers["x-total-count"];
      } catch (err) {
        console.log("getTodos Err : ", err);
        error.value = "Somthing went wrong.";
      }
    };
    getTodos();

    const addTodo = async (todo) => {
      error.value = "";

      try {
        await axios.post("http://localhost:3000/todos", {
          subject: todo.subject,
          completed: false,
        });
        getTodos(1);
      } catch (err) {
        console.log("addTodo Err : ", err);
        error.value = "Somthing went wrong.";
      }
    };

    const deleteTodo = async (index) => {
      error.value = "";

      const id = todos.value[index].id;
      try {
        await axios.delete(`http://localhost:3000/todos/${id}`);
        getTodos(1);
      } catch (err) {
        console.log(err);
        error.value = "Somthing went wrong.";
      }
    };

    const toggleTodo = async (index, checked) => {
      const id = todos.value[index].id;
      try {
        await axios.patch(`http://localhost:3000/todos/${id}`, {
          completed: checked,
        });

        todos.value[index].completed = checked;
      } catch (err) {
        console.log(err);
        error.value = "Somthing went wrong.";
      }
    };

    let timeout = null;
    const searchTodo = () => {
      clearTimeout(timeout);
      getTodos(1);
    };
    watch(searchText, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTodos(1);
      }, 2000);
    });
    /*     
    const filteredTodos = computed(() => {
      if (searchText.value) {
        return todos.value.filter((todo) => {
          return todo.subject.includes(searchText.value);
        });
      }
      return todos.value;
    }); */

    return {
      todos,
      searchText,
      error,

      numberOfTodos,
      limit,
      numberOfPages,
      currentPage,

      searchTodo,
      getTodos,
      addTodo,
      deleteTodo,
      toggleTodo,
      /* filteredTodos, */
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
