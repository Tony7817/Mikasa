import { ref } from "vue";

export function setup() {
  const contactName = ref("");
  const contactEmail = ref("");
  const contactUserName = ref("");
  const contactPlatform = ref("");

  return {
    contactName,
    contactEmail,
    contactUserName,
    contactPlatform,
  };
}
