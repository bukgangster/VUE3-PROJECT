<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
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
</template>

<script>
export default {
  components: {},
  setup() {
    return {};
  },
};
</script>

<style></style>
