import { api } from "boot/axios";

export const service = {
  getStarList(data) {
    return api.post("/star/list", data, {
      "Content-Type:": "application/json",
    });
  },
};
