<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input type="text" class="form-control" :value="subject" @input="onInput" />
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
  },

  setup() {
    const { emit } = getCurrentInstance();

    const onInput = (e) => {
      console.log(e.target.value);
      emit("update:subject", e.target.value);
    };

    return {
      onInput,
    };
  },
};
</script>

<style scoped>
.text-red {
  color: red;
}
</style>
