// src/services/userService.js
import api from "./api";

export const userService = {
  // 获取用户信息
  getUserInfo(userId) {
    return api.get(`/users/${userId}`);
  },

  // 用户登录
  login(credentials) {
    return api.post("/user/login", credentials);
  },

  // 用户注册
  register(userData) {
    return api.post("/user/register", userData);
  },
};
