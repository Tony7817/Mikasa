import { boot } from "quasar/wrappers";
import { useUserStore } from "src/stores/user";
import { Loading } from "quasar";
import { jwtDecode } from "jwt-decode";

function isAuthenticated() {
  const userStore = useUserStore();
  if (!userStore.user?.token) {
    return false;
  }
  const token = jwtDecode(userStore.user.token);
  const currentTime = Date.now() / 1000;
  if (token.exp < currentTime) {
    userStore.clearUser();
    return false;
  }
  return true;
}
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  router.beforeEach((to, from, next) => {
    Loading.show({
      message: "Loading...",
    });
    const isAuth = isAuthenticated();
    if (to.name === "login") {
      if (isAuth) {
        next({ name: "home" });
      } else {
        next();
      }
    } else if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!isAuth) {
        next({ name: "login", query: { next: to.fullPath } });
      } else {
        next();
      }
    } else {
      next();
    }
  });

  router.afterEach(() => {
    Loading.hide();
  });
});
