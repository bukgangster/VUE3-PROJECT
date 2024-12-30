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
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();

    const showNav = computed(() => route.name !== "SlmHome");

    return {
      showNav,
    };
  },
};
</script>

<style></style>
