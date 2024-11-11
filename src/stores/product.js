import { defineStore } from "pinia";

export const useCounterStore = defineStore("product", {
  state: () => ({
    cartAmnout: 0,
  }),

  getters: {
    getProductAmountInCart(state) {
      return state.cartAmnout;
    },
  },

  actions: {
    increment() {
      this.cartAmnout++;
    },
  },
  persist: true,
});
