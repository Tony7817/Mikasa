// src/stores/user.js
import { defineStore } from "pinia";
import { Cookies } from "quasar";

// Have to use option API. Composition API won't work
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      isAuthenticated: false,
      user: null,
    };
  },
  actions: {
    setUser(userData) {
      this.user = userData;
      this.isAuthenticated = true;
      this.user.token = userData.token;
    },
    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
    },
    hydrate() {
      const token = Cookies.get("auth_token");
      const isAuthenticated = JSON.parse(
        localStorage.getItem("isAuthenticated")
      );
      const userData = JSON.parse(localStorage.getItem("user"));
      if (token && isAuthenticated && userData) {
        this.setUser(userData);
      }
    },
  },
  persist: true,
});
