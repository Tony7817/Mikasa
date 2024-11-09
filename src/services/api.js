import { api } from "boot/axios";
import { useUserStore } from "src/stores/user";

export const service = {
  getStarList(data) {
    return api.post("/star/list", data, {
      headers: {
        "Content-Type:": "application/json",
      },
    });
  },

  getBrandList(data) {
    return api.post("/brand/list", data, {
      header: {
        "Content-Type:": "application/json",
      },
    });
  },

  getProductList(data) {
    return api.post("/product/list", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  getProductDetail(id, data) {
    return api.post(`/product/${id}`, data);
  },

  getStarDetail(id, data) {
    return api.post(`/star/${id}`, data);
  },

  getCartList(data) {
    const userStore = useUserStore();
    return api.post("/cart/list", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  addAmount(productId, data) {
    const userStore = useUserStore();
    return api.post(`/cart/product/${productId}/add`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  decreaseAmount(productId, data) {
    const userStore = useUserStore();
    return api.post(`/cart/product/${productId}/decrease`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },
};
