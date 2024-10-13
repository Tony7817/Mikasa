import { api } from "boot/axios";

export default {
  // 通用的 GET 请求
  get(url, params = {}) {
    return api
      .get(url, { params })
      .then((response) => response.data)
      .catch((error) => {
        console.error("API GET request failed:", error);
        throw error;
      });
  },

  // 通用的 POST 请求
  post(url, data) {
    return api
      .post(url, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("API POST request failed:", error);
        throw error;
      });
  },

  // 通用的 PUT 请求
  put(url, data) {
    return api
      .put(url, data)
      .then((response) => response.data)
      .catch((error) => {
        console.error("API PUT request failed:", error);
        throw error;
      });
  },

  // 通用的 DELETE 请求
  delete(url) {
    return api
      .delete(url)
      .then((response) => response.data)
      .catch((error) => {
        console.error("API DELETE request failed:", error);
        throw error;
      });
  },
};
