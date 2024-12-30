import { computed } from "vue";
import { useStore } from "vuex";

export const useToast = () => {
  const store = useStore();
  console.log("toast.js");
  console.log(store);

  const toasts = computed(() => store.state.toast.toasts);
  // const toastMessage = computed(
  //   () => store.getters["toast/toastMessageWithSmile"]
  // );
  // const toastAlertType = computed(() => store.state.toast.toastAlertType);
  // const showToast = computed(() => store.state.toast.showToast);

  const triggerToast = (message, type = "success") => {
    store.dispatch("toast/triggerToast", { message, type });
  };

  return {
    // toastMessage,
    // toastAlertType,
    // showToast,
    toasts,
    triggerToast,
  };
};
