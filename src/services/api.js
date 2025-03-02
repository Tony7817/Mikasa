import axios, { api } from "boot/axios";
import JSEncrypt from "jsencrypt";
import { getLocation } from "src/composables/user";
import { useUserStore } from "src/stores/user";
import CryptoJS from "crypto-js";

const userStore = useUserStore();
const key = "aaaasdf";
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuJ51+zwDv54l7H7tqpgU
pmsxiB65yfp8ndqwITeKlWSY/VQKZOEPuQpeZjzD7SrtnG9aOwLn9G8gyf2LH0y6
l9C8noyRBtfjX4ThMm11mtHBJfbu4XBUDz7n5jh8MhXu1OHvTZKu6IgMlf99G2x5
96zU+15dDCK51kqwMg2G0jaQx8Tn39aMK1LETBLkitemkldvU/RB1WcOowM5a0tV
VkmIZSJnY7UwFtglA9wiR1gz5zTd3zXEy7XU36tJHo4Emapi6L9WbAAvHyY2Rbbd
8tRwrmB/TMn2YTNmPxVj91hIx+5QmPQi3lhM3gmurMHf0dzne+8aLt1fMVl5QhWk
rwIDAQAB
-----END PUBLIC KEY-----
`;

const desk_headers = {
  "Content-Type": "application/json",
};

export const service = {
  signup(data) {
    return api.post("/api/user/signup", data, {
      headers: {
        ...desk_headers,
      },
    });
  },
  signin(data) {
    return api.post("/api/user/signin", data, {
      headers: {
        ...desk_headers,
      },
    });
  },
  signinWithGoogle(data) {
    return api.post("/api/user/signin/google", data, {
      headers: {
        ...desk_headers,
      },
    });
  },
  getStarList(data) {
    return api.post("/api/star/list", data, {
      headers: {
        ...desk_headers,
      },
    });
  },

  getBrandList(data) {
    return api.post("/api/recommend/star/list", data, {
      header: {
        ...desk_headers,
      },
    });
  },

  getProductList(data) {
    return api.post(`/api/product/list`, data, {
      headers: {
        ...desk_headers,
      },
    });
  },

  getProductDetail(id, data) {
    return api.post(`/api/product/${id}`, data, {
      headers: {
        ...desk_headers,
      },
    });
  },

  getStarDetail(id) {
    return api.post(
      `/api/star/${id}`,
      {},
      {
        headers: {
          ...desk_headers,
        },
      }
    );
  },

  getCartList(data) {
    return api.post("/api/cart/list", data, {
      headers: {
        Authorization: `Bearer ${userStore.user.token}`,
        ...desk_headers,
      },
    });
  },

  addAmount(data) {
    return api.post(`/api/cart/increase/amount`, data, {
      headers: {
        Authorization: `Bearer ${userStore.user.token}`,
        ...desk_headers,
      },
    });
  },

  decreaseAmount(data) {
    return api.post(`/api/cart/decrease/amount`, data, {
      headers: {
        Authorization: `Bearer ${userStore.user.token}`,
        ...desk_headers,
      },
    });
  },

  addProductToCart(data) {
    return api.post(`/api/cart/add/product`, data, {
      headers: {
        Authorization: `Bearer ${userStore.user.token}`,
        ...desk_headers,
      },
    });
  },

  removeProductFromCart(data) {
    return api.post(`/api/cart/remove`, data, {
      headers: {
        Authorization: `Bearer ${userStore.user.token}`,
        ...desk_headers,
      },
    });
  },

  getIp() {
    return api.get("/api/user/ip");
  },

  stableJSONStringify(obj) {
    // 确保键名按字典序排序
    return JSON.stringify(obj, Object.keys(obj).sort());
  },

  sign(bodyStr, route) {
    const time = (Date.now() / 1000).toFixed();
    const secret = `type=0;key=${btoa(key)};time=${time}`;
    var encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    const secretEncoded = encryptor.encrypt(secret);
    const hash = CryptoJS.SHA256(bodyStr);
    const dataStr = hash.toString(CryptoJS.enc.Hex);
    const signature = `${time}\nPOST\n${route}\n\n${dataStr}`;
    const signatureHash = CryptoJS.HmacSHA256(signature, key);
    const signatureEncoded = CryptoJS.enc.Base64.stringify(signatureHash);
    return `key=${key};secret=${secretEncoded};signature=${signatureEncoded}`;
  },

  sendSignupCaptcha(data) {
    const route = "/api/user/signup/captcha";
    const bodyStr = this.stableJSONStringify(data);
    const xcs = this.sign(bodyStr, route);

    return api.post(route, bodyStr, {
      headers: {
        "X-Content-Security": xcs,
        "Content-Type": "application/json",
      },
    });
  },

  sendForgetPasswordCaptcha(data) {
    const route = "/api/user/forgetpassword/captcha";
    const bodyStr = this.stableJSONStringify(data);
    const xcs = this.sign(bodyStr, route);

    return api.post(route, bodyStr, {
      headers: {
        "X-Content-Security": xcs,
        "Content-Type": "application/json",
      },
    });
  },

  verifyCaptcha(data) {
    return api.post("/api/user/verify/captcha", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  verifyAccountCaptcha(data) {
    return api.post("/api/user/verifyaccount/captcha", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  resetPassword(data) {
    return api.post("/api/user/forgetpass/reset", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  getUserDetail(data) {
    return api.post(`/api/user/detail`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  getManageStarList(data) {
    return api.post("/api/user/manage/star/list", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  getOssToken(data) {
    const route = "/api/user/file/token";
    const bodyStr = this.stableJSONStringify(data);
    const xcs = this.sign(bodyStr, route);
    return api.post(route, data, {
      headers: {
        "X-Content-Security": xcs,
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  createStar(data) {
    return api.post("/api/star/create", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  updateStar(starId, data) {
    return api.post(`/api/star/${starId}/update`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  getProductsByOrg(starId, data) {
    return api.post(`/api/star/${starId}/products`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  createProduct(starId, data) {
    return api.post(`/api/star/${starId}/product/create`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },
  getProductDetailByOrg(starId, productId) {
    return api.post(
      `/api/star/${starId}/product/${productId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userStore.user.token}`,
        },
      }
    );
  },
  getOrderList(data) {
    return api.post(`/api/order/list`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },

  getOrderItems(orderId) {
    return api.post(
      `/api/order/${orderId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userStore.user.token}`,
        },
      }
    );
  },
  createOrder(data) {
    return api.post(`/api/order/create`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },
  createPaypalOrder(data) {
    return api.post(`/api/order/paypal/create`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },
  checkIfUserSignedUp(data) {
    return api.post(`/api/user/check`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  captureOrder(data) {
    return api.post(`/api//order/paypal/capture`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userStore.user.token}`,
      },
    });
  },
  getOrderDetail(orderId) {
    return api.post(
      `/api/order/${orderId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userStore.user.token}`,
        },
      }
    );
  },
  getOrderAddress(orderId) {
    return api.post(
      `/api/order/address/${orderId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userStore.user.token}`,
        },
      }
    );
  },
};
