import { api } from "boot/axios";
import { useUserStore } from "src/stores/user";

const userStore = useUserStore();

export const service = {
  getStarList(data) {
    return api.post("/star/list", data, {
      headers: {
        "Content-Type": "application/json",
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
    return api.post("/cart/list", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  addAmount(productCartId, data) {
    return api.post(`/cart/product/${productCartId}/add`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  decreaseAmount(productCartId, data) {
    return api.post(`/cart/product/${productCartId}/decrease`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  addProductToCart(productId, data) {
    return api.post(`/cart/add/${productId}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  removeProductFromCart(productCartId, data) {
    return api.post(`/cart/remove/${productCartId}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },
};
