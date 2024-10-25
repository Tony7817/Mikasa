const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
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
    ],
  },
  {
    path: "/login",
    component: () => import("layouts/LoginLayout.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
