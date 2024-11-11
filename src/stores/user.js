// src/stores/user.js
import { defineStore } from "pinia";

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
  },
  persist: true,
});
