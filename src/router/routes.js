import { useUserStore } from "src/stores/user";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("src/pages/desktop/DesktopHomePage.vue"),
      },
      {
        path: "/stars",
        name: "stars",
        component: () => import("pages/StarList.vue"),
        props: true,
      },
      {
        path: "/star/:id",
        component: () => import("pages/StarDetail.vue"),
      },
      {
        path: "/star/:starId/product/:productId",
        component: () => import("pages/ProductDetail.vue"),
      },
      {
        path: "/cart",
        component: () => import("pages/ProductCart.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/user",
        component: () => import("pages/UserDetail.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("layouts/LoginLayout.vue"),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.isAuthenticated) {
        next(from.path);
      } else {
        next();
      }
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
