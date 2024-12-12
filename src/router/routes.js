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
        path: "/cart",
        name: "product-cart",
        component: () => import("pages/ProductCart.vue"),
        meta: { requiresAuth: true, tab: ProductTab },
      },
      {
        path: "/user/manage",
        name: "user-detail",
        component: () => import("pages/UserDetail.vue"),
        meta: { requiresAuth: true, tab: null },
        redirect: "/user/manage/account",
        children: [
          {
            path: "/user/manage/account",
            name: "UserManageAccount",
            component: () => import("src/pages/desktop/manage/UserAccount.vue"),
          },
          {
            path: "/user/manage/star",
            name: "UserManageStar",
            component: () =>
              import("src/pages/desktop/manage/DesktopStarlist.vue"),
          },
          {
            path: "/user/manage/star/add",
            name: "UserManageStarAdd",
            component: () =>
              import("src/pages/desktop/manage/DesktopAddUpdStar.vue"),
          },
          {
            path: "/user/manage/star/:starId",
            name: "UserManageStarDetail",
            props: true,
            component: () =>
              import("src/pages/desktop/manage/DesktopAddUpdStar.vue"),
          },
          {
            path: "/user/manage/star/:starId/products",
            name: "UserManageProduct",
            props: true,
            component: () =>
              import("src/pages/desktop/manage/DesktopProductList.vue"),
          },
          {
            path: "/user/manage/star/:starId/product/add",
            name: "UserManageProductAdd",
            props: true,
            component: () =>
              import("src/pages/desktop/manage/DesktopAddUpdProduct.vue"),
          },
        ],
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
