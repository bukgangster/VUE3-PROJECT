<template>
  <nav v-if="showNav" class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" :to="{ name: 'Home' }"
      >Kossie Coder</router-link
    >

    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <router-link class="nav-link" to="/todos">Todos</router-link>
      </li>
    </ul>
  </nav>

  <div class="container">
    <router-view />
  </div>

  <ToastComp :message="toastMessage" :type="toastAlertType" />
</template>

<script>
import { useRoute } from "vue-router";
import { computed } from "vue";

import ToastComp from "./components/ToastComp.vue";
import { useToast } from "./composables/toast";

export default {
  components: {
    ToastComp,
  },
  setup() {
    const route = useRoute();

    const showNav = computed(() => route.name !== "SlmHome");

    const { toastMessage, toastAlertType, showToast, triggerToast } =
      useToast();

    return {
      showNav,
      toastMessage,
      toastAlertType,
      showToast,

      triggerToast,
    };
  },
};
</script>

<style></style>
