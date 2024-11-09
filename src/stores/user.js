// src/stores/user.js
import { defineStore } from "pinia";
import { Cookies } from "quasar";
import { ref } from "vue";

// Have to use option API. Composition API won't work
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      isAuthenticated: false,
      user: null,
      token: "",
    };
  },
  actions: {
    setUser(userData) {
      this.user = userData;
      this.isAuthenticated = true;
      this.token = userData.token;
    },
    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = "";
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
