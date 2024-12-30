<template>
  <div class="container">
    <NavBar />

    <router-view />
  </div>

  <!-- <transition name="slide"> -->
  <!-- <ToastComp :message="`hello`" :type="`success`" /> -->
  <ToastComp />
  <!-- </transition> -->
</template>

<script>
import NavBar from "./components/NavBar.vue";
import ToastComp from "./components/ToastComp.vue";
// import { useToast } from "./composables/toast";
import { useStore } from "vuex";
export default {
  components: {
    NavBar,
    ToastComp,
  },
  setup() {
    const store = useStore();
    console.log(store.state);

    // const { toastMessage, toastAlertType, showToast, triggerToast } =
    //   useToast();

    return {
      // toastMessage,
      // toastAlertType,
      // showToast,
      // triggerToast,
    };
  },
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>
