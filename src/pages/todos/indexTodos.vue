<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h2>To-do List</h2>
      <button class="btn btn-primary" @click="moveToCreatePage">
        Create Todo
      </button>
    </div>

    <input
      type="text"
      class="form-control"
      v-model="searchText"
      placeholder="Search"
      @keyup.enter="searchTodo"
    />
    <hr />

    <!-- <TodoSimpleForm @add-todo="addTodo" /> -->
    <div>{{ error }}</div>

    <div v-if="!todos.length">There is nothing to display.</div>
    <TodoList
      :todos="todos"
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"
    />
  </div>
  <hr />

  <PaginationComp
    v-if="todos.length"
    :numberOfPages="numberOfPages"
    :currentPage="currentPage"
    @click="getTodos"
  />
</template>

<script>
import axios from "@/axios";

import { ref, computed, watch } from "vue";
// import TodoSimpleForm from "@/components/TodoSimpleForm.vue";
import TodoList from "@/components/TodoList.vue";
import PaginationComp from "@/components/PaginationComp.vue";

import { useToast } from "@/composables/toast";
import { useRouter } from "vue-router";

export default {
  components: {
    // TodoSimpleForm,
    TodoList,
    PaginationComp,
  },
  setup() {
    const router = useRouter();
    const todos = ref([]);
    const error = ref("");
    const searchText = ref("");

    const numberOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);

    const { toastMessage, toastAlertType, showToast, triggerToast } =
      useToast();

    // const toastMessage = ref("");
    // const toastAlertType = ref("");
    // const showToast = ref(false);
    // const toastTimeout = ref(null);
    // const triggerToast = (message, type = "success") => {
    //   toastMessage.value = message;
    //   toastAlertType.value = type;
    //   showToast.value = true;

    //   triggerToast.value = setTimeout(() => {
    //     toastMessage.value = "";
    //     showToast.value = false;
    //   }, 3000);
    // };

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value / limit);
    });

    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;

      try {
        const res = await axios.get(
          `todos?_sort=id&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`
        );
        todos.value = res.data;
        numberOfTodos.value = res.headers["x-total-count"];
      } catch (err) {
        console.log("getTodos Err : ", err);
        error.value = "Somthing went wrong.";
        triggerToast("Somthing went wrong.", "danger");
      }
    };
    getTodos();

    const addTodo = async (todo) => {
      error.value = "";

      try {
        await axios.post("todos", {
          subject: todo.subject,
          completed: false,
        });
        getTodos(1);
      } catch (err) {
        console.log("addTodo Err : ", err);
        error.value = "Somthing went wrong.";
        triggerToast("Somthing went wrong.", "danger");
      }
    };

    const deleteTodo = async (id) => {
      error.value = "";

      // const id = todos.value[index].id;
      try {
        await axios.delete(`todos/${id}`);
        getTodos(1);
      } catch (err) {
        console.log(err);
        error.value = "Somthing went wrong.";
        triggerToast("Somthing went wrong.", "danger");
      }
    };

    const toggleTodo = async (index, checked) => {
      const id = todos.value[index].id;
      try {
        await axios.patch(`todos/${id}`, {
          completed: checked,
        });

        todos.value[index].completed = checked;
      } catch (err) {
        console.log(err);
        error.value = "Somthing went wrong.";
        triggerToast("Somthing went wrong.", "danger");
      }
    };

    const moveToCreatePage = () => {
      router.push({
        name: "TodoCreate",
      });
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
      showToast,
      toastMessage,
      toastAlertType,
      // toastTimeout,
      router,

      searchTodo,
      getTodos,
      addTodo,
      deleteTodo,
      toggleTodo,
      triggerToast,
      moveToCreatePage,
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
