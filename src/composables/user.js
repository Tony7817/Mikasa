import { ref } from "vue";

export function validateEmailx() {
  const emailError = ref("");
  const validateEmail = (val) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(val)) {
      emailError.value = "Please enter a valid email";
      return false;
    }
    emailError.value = "";
    return true;
  };

  return {
    emailError,
    validateEmail,
  };
}
