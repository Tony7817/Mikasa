import { boot } from "quasar/wrappers";
import { useUserStore } from "src/stores/user";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  router.beforeEach((to, from, next) => {
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
});
