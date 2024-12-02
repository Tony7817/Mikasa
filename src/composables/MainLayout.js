import { ref, watch } from "vue";
import { useUserStore } from "src/stores/user";
import { useRouter, useRoute } from "vue-router";
import {
  HomeTab,
  ContactTab,
  StarsTab,
  ProductTab,
} from "src/composables/consts";

export function setup() {
  const keyword = ref("");
  const triggerSearch = ref(false);
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const productAmountInCart = ref(0);
  const loading = ref(false);
  const selectedTab = ref(route.meta.tab);

  function onSearch() {
    triggerSearch.value = !triggerSearch.value;
  }

  function toStars() {
    router.push({ name: "stars" });
  }

  function toContact() {
    router.push({ name: "contact" });
  }

  function toHome() {
    router.push({ name: "home" });
  }

  function toProduct() {
    router.push({ name: "product" });
  }

  async function onload() {
    if (loading.value) {
      return;
    }

    loading.value = true;

    try {
    } catch (error) {}

    loading.value = false;
  }

  function signIn() {
    if (!userStore.isAuthenticated) {
      router.push({ name: "login", query: { next: route.path } });
    }
  }

  return {
    keyword,
    triggerSearch,
    userStore,
    router,
    route,
    productAmountInCart,
    loading,
    selectedTab,
    onSearch,
    toContact,
    toStars,
    toHome,
    toProduct,
    onload,
    signIn,
  };
}
