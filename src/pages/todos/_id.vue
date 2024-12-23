<template>
  <h1>To-do Page</h1>

  <div v-if="loading">Loading...</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Subject</label>
          <input type="text" class="form-control" v-model="todo.subject" />
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button
              class="btn"
              type="button"
              :class="todo.completed ? 'btn-success' : 'btn-danger'"
              @click.prevent="toggleTodoStatus"
            >
              {{ todo.completed ? "Completed" : "Incomplete" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">
      Save
    </button>
    <button class="btn btn-outline-dark ml-2" @click="moveToTodoListPage">
      Cancel
    </button>
  </form>

  <ToastComp v-if="showToast" :message="toastMessage" :type="toastAlertType" />
</template>

<script>
import ToastComp from "@/components/ToastComp.vue";

import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import _ from "lodash";

export default {
  components: {
    ToastComp,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const todo = ref(null);
    const originalTodo = ref(null);
    const loading = ref(true);
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastAlertType = ref("");

    const todoId = route.params.id;

    const getTodo = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/todos/${todoId}`);

        console.log(res);

        loading.value = false;
        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
      } catch (err) {
        triggerToast("Something went wrong!!", "danger");
      }
    };

    const todoUpdated = computed(() => {
      return !_.isEqual(todo.value, originalTodo.value);
    });

    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed;
    };

    const moveToTodoListPage = () => {
      router.push({
        name: "Todos",
      });
    };

    getTodo();

    const triggerToast = (message, type = "success") => {
      toastMessage.value = message;
      toastAlertType.value = type;
      showToast.value = true;

      setTimeout(() => {
        toastMessage.value = "";
        showToast.value = false;
      }, 3000);
    };

    const onSave = async () => {
      try {
        const res = await axios.put(`http://localhost:3000/todos/${todoId}`, {
          subject: todo.value.subject,
          completed: todo.value.completed,
        });

        originalTodo.value = { ...res.data };
        triggerToast("Successfully saved!!");
      } catch (err) {
        triggerToast("Something went wrong!!", "danger");
      }
    };

    return {
      getTodo,
      toggleTodoStatus,
      moveToTodoListPage,
      onSave,
      triggerToast,

      todoUpdated,
      todo,
      loading,
      showToast,
      toastMessage,
      toastAlertType,
    };
  },
};
</script>

<style></style>
