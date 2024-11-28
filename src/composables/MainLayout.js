import { ref } from "vue";
import { useUserStore } from "src/stores/user";
import { useRouter, useRoute } from "vue-router";
import { HomeTab, ContactTab, StarsTab } from "src/composables/consts";

export function setup() {
  const keyword = ref("");
  const triggerSearch = ref(false);
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const productAmountInCart = ref(0);
  const loading = ref(false);
  const selectedTab = ref(HomeTab);

  function onSearch() {
    triggerSearch.value = !triggerSearch.value;
  }

  function toContact() {
    selectedTab.value = ContactTab;
  }

  function toStars() {
    selectedTab.value = StarsTab;
    router.push({ name: "stars" });
  }

  function toHome() {
    selectedTab.value = HomeTab;
    router.push({ name: "home" });
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
    onload,
    signIn,
  };
}
