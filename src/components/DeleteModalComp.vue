<template>
  <!-- v-on: => @  //  v-bind: => :  //  v-slot: => #  -->
  <ModalComp>
    <template #title>Delete Todo!</template>
    <template #body>Are you sure you want to delete this todo?</template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="onClose">
        Close
      </button>
      <button type="button" class="btn btn-danger" @click="onDelete">
        Delete
      </button>
    </template>
  </ModalComp>
</template>

<script>
import { getCurrentInstance } from "vue";
import ModalComp from "@/components/ModalComp.vue";
export default {
  components: {
    ModalComp,
  },

  emits: ["close", "delete"],

  setup() {
    const { emit } = getCurrentInstance();

    const onClose = () => {
      emit("close");
    };

    const onDelete = () => {
      emit("delete");
    };

    return {
      onClose,
      onDelete,
    };
  },
};
</script>

<style></style>
