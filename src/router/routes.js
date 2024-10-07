const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        component: () => import("pages/StarList.vue"),
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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
