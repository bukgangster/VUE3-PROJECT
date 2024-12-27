<template>
  <!-- <div class="card mt-2" v-for="(todo, index) in todos" :key="todo.id"> -->
  <ListComp :items="todos">
    <template #default="{ item, index }">
      <div
        class="card-body p-2 d-flex align-items-center"
        style="cursor: pointer"
        @click="moveToPage(item.id)"
      >
        <div class="flex-grow-1">
          <input
            class="ml-2 mr-2"
            type="checkbox"
            :checked="item.completed"
            @change="toggleTodo(index, $event)"
            @click.stop
          />
          <span :class="{ item: item.completed }">
            {{ item.subject }}
          </span>
        </div>

        <div>
          <button
            class="btn btn-danger btn-sm"
            @click.stop="openModal(item.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </template>
  </ListComp>
  <!-- </div> -->

  <teleport to="#modal">
    <DeleteModalComp
      v-if="showModal"
      @close="closeModal"
      @delete="deleteTodo"
    />
  </teleport>
</template>

<script>
import DeleteModalComp from "./DeleteModalComp.vue";
import ListComp from "./ListComp.vue";

import { useRouter } from "vue-router";
import { ref } from "vue";
export default {
  components: {
    DeleteModalComp,
    ListComp,
  },
  props: {
    todos: {
      type: Array,
      Required: true,
    },
  },
  emits: ["toggle-todo", "delete-todo"],

  setup(props, { emit }) {
    const router = useRouter();
    const showModal = ref(false);
    const todoDeleteId = ref(null);

    const openModal = (id) => {
      todoDeleteId.value = id;
      showModal.value = true;
    };

    const closeModal = () => {
      todoDeleteId.value = null;
      showModal.value = false;
    };

    const toggleTodo = (index, event) => {
      emit("toggle-todo", index, event.target.checked);
    };

    const deleteTodo = () => {
      emit("delete-todo", todoDeleteId.value);

      showModal.value = false;
      todoDeleteId.value = null;
    };

    const moveToPage = (todoId) => {
      console.log(todoId);
      //      router.push(`/todos/${todoId}`);
      router.push({
        name: "Todo",
        params: {
          id: todoId,
        },
      });
    };

    return {
      toggleTodo,
      deleteTodo,
      moveToPage,
      openModal,
      closeModal,

      showModal,
      todoDeleteId,
    };
  },
};
</script>

<style></style>
