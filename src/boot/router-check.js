import { boot } from "quasar/wrappers";
import { useUserStore } from "src/stores/user";
import { Loading } from "quasar";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  router.beforeEach((to, from, next) => {
    Loading.show({
      message: "Loading...",
    });
    const userStore = useUserStore();
    if (
      to.matched.some((record) => record.meta.requiresAuth) &&
      !userStore.isAuthenticated
    ) {
      next({ name: "login", query: { next: to.fullPath } });
    } else {
      next();
    }
  });

  router.afterEach(() => {
    Loading.hide();
  });
});
