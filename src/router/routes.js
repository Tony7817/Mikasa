import { jwtDecode } from "jwt-decode";
import { useQuasar } from "quasar";
import {
  ContactTab,
  HomeTab,
  ProductTab,
  StarsTab,
} from "src/composables/consts";
import { useUserStore } from "src/stores/user";

const $q = useQuasar();
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("src/pages/HomePage.vue"),
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
        props: true,
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
        path: "/product/order/:orderId",
        props: true,
        name: "product-order",
        component: () => import("pages/desktop/DesktopProductOrder.vue"),
        meta: { tab: ProductTab, requiresAuth: true },
      },
      {
        path: "/cart",
        name: "product-cart",
        component: () => import("pages/ProductCart.vue"),
        meta: { requiresAuth: true, tab: ProductTab },
      },
      {
        path: "/user/manage",
        name: "user-detail",
        component: () => import("src/pages/UserDetail.vue"),
        meta: { requiresAuth: true, tab: null },
        redirect: "/user/manage/account",
        children: [
          {
            path: "/user/manage/account",
            name: "UserManageAccount",
            component: () => import("src/pages/desktop/manage/DesktopUserInfo.vue"),
          },
          {
            path: "/user/order",
            name: "UserOrder",
            component: () =>
              import("src/pages/desktop/manage/DesktopProductOrder.vue"),
          },
          {
            path: "/user/order/:orderId",
            name: "UserOrderDetail",
            props: true,
            component: () =>
              import("src/pages/desktop/manage/DesktopOrderDetail.vue"),
          },
        ],
        beforeEnter(to, from, next) {
          const userStore = useUserStore();
          const token = jwtDecode(userStore.user.token);
          const currentTime = Date.now() / 1000;
          if (token.exp < currentTime) {
            userStore.clearUser();
          } else {
            console.log("Token is valid");
          }
          next();
        },
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
    path: "/policy",
    name: "policy",
    component: () => import("layouts/PolicyLayout.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("layouts/LoginLayout.vue"),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      const token = jwtDecode(userStore.user.token);
      const currentTime = Date.now() / 1000;
      if (token.exp < currentTime) {
        userStore.clearUser();
      } else {
        console.log("Token is valid");
      }
      next();
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
