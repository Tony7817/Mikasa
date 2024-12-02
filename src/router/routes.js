import {
  ContactTab,
  HomeTab,
  ProductTab,
  StarsTab,
} from "src/composables/consts";
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
        meta: { tab: HomeTab },
      },
      {
        path: "/stars",
        name: "stars",
        component: () => import("pages/StarList.vue"),
        props: true,
        meta: { tab: StarsTab },
      },
      {
        path: "/star/:id",
        component: () => import("pages/StarDetail.vue"),
        meta: { tab: StarsTab },
      },
      {
        path: "/product/:productId",
        component: () => import("pages/ProductDetail.vue"),
        meta: { tab: ProductTab },
      },
      {
        path: "/product",
        name: "product",
        component: () => import("pages/ProductList.vue"),
        meta: { tab: ProductTab },
      },
      {
        path: "/cart",
        name: "product-cart",
        component: () => import("pages/ProductCart.vue"),
        meta: { requiresAuth: true, tab: ProductTab },
      },
      {
        path: "/user",
        name: "user-detail",
        component: () => import("pages/UserDetail.vue"),
        meta: { tab: null },
      },
      {
        path: "/contact",
        name: "contact",
        component: () => import("pages/ContactPage.vue"),
        meta: { tab: ContactTab },
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
