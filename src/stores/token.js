import { defineStore } from "pinia";

export const useStsStore = defineStore("sts", {
  state: () => ({
    token: null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
  },
  persist: true,
});
