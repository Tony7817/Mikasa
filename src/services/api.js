import { api } from "boot/axios";

export const service = {
  getStarList(data) {
    return api.post("/star/list", data, {
      "Content-Type:": "application/json",
    });
  },

  getBrandList(data) {
    return api.post("/brand/list", data, {
      "Content-Type:": "application/json",
    });
  },

  getProductList(data) {
    return api.post("/product/list", data, {
      "Content-Type": "application/json",
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
      "Content-Type": "application/json",
    });
  },
};
