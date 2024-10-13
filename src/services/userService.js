// src/services/userService.js
import { api } from "boot/axios";

export const userService = {
  // 获取用户信息

  // 用户登录
  postFormData(url, data) {
    return api.post(url, data, {
      "Content-Type": "multipart/form-data",
    });
  },
  // 用户注册
};
