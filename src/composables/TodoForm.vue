<template>
  <div v-if="loading">Loading...</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Subject</label>
          <input type="text" class="form-control" v-model="todo.subject" />
          <div v-if="subjectError" style="color: red">
            {{ subjectError }}
          </div>
        </div>
      </div>

      <div v-if="editing" class="col-6">
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

      <div class="col-12">
        <div class="form-group">
          <label>Body</label>
          <textarea v-model="todo.body" class="form-control" cols="30" rows="5">
          </textarea>
        </div>
      </div>
    </div>

    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">
      {{ editing ? "Update" : "Create" }}
    </button>
    <button class="btn btn-outline-dark ml-2" @click="moveToTodoListPage">
      Cancel
    </button>
  </form>

  <ToastComp v-if="showToast" :message="toastMessage" :type="toastAlertType" />
</template>

<script>
import ToastComp from "@/components/ToastComp.vue";

import { useToast } from "@/composables/toast";

import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import _ from "lodash";

export default {
  components: {
    ToastComp,
  },
  props: {
    editing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject: "",
      completed: false,
      body: "",
    });
    const subjectError = ref("");
    const originalTodo = ref(null);
    const loading = ref(false);
    const todoId = route.params.id;

    const { toastMessage, toastAlertType, showToast, triggerToast } =
      useToast();

    // const showToast = ref(false);
    // const toastMessage = ref("");
    // const toastAlertType = ref("");
    // const timeout = ref(null);
    // const triggerToast = (message, type = "success") => {
    //   toastMessage.value = message;
    //   toastAlertType.value = type;
    //   showToast.value = true;

    //   timeout.value = setTimeout(() => {
    //     toastMessage.value = "";
    //     showToast.value = false;
    //   }, 3000);
    // };

    const getTodo = async () => {
      loading.value = true;
      try {
        const res = await axios.get(`http://localhost:3000/todos/${todoId}`);

        console.log(res);

        loading.value = false;
        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
      } catch (err) {
        loading.value = false;
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

    if (props.editing) {
      getTodo();
    }

    const onSave = async () => {
      subjectError.value = "";
      if (!todo.value.subject) {
        subjectError.value = "Subject is required.";
        return;
      }
      try {
        let res;
        const data = {
          subject: todo.value.subject,
          completed: todo.value.completed,
          body: todo.value.body,
        };
        if (props.editing) {
          res = await axios.put(`http://localhost:3000/todos/${todoId}`, data);
          originalTodo.value = { ...res.data };
        } else {
          res = await axios.post(`http://localhost:3000/todos`, data);
          todo.value.subject = "";
          todo.value.body = "";
        }

        triggerToast(`Successfully ${props.editing ? "Updated" : "Created"}`);
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
      //   timeout,
      subjectError,
    };
  },
};
</script>

<style scoped>
.text-red {
  color: red;
}
</style>
