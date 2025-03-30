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
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!userStore.user?.token) {
        next({ name: "login", query: { next: to.fullPath } });
      }
      const token = jwtDecode(userStore.user.token);
      const currentTime = Date.now() / 1000;
      if (token.exp < currentTime) {
        userStore.clearUser();
        next({ name: "login", query: { next: to.fullPath } });
      }
    } else {
      next();
    }
  });

  router.afterEach(() => {
    Loading.hide();
  });
});
