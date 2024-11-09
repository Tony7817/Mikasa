import { useUserStore } from "src/stores/user";

export default async ({ app, store }) => {
  const userStore = useUserStore();
  userStore.hydrate();
};
