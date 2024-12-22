import { service } from "src/services/api";
import { ref } from "vue";
import { SignupMode } from "./consts";

export async function getLocation(ip) {
  const key = "be62fa1ff16346b9f29fa6675e9668f5";
  const api = "http://api.ipstack.com/" + ip + "?access_key=" + key;

  try {
    const response = await fetch(api, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return "";
  }
}

export function validator() {
  const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
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

  const phoneError = ref("");
  const validatePhone = (val) => {
    const phonePattern = /^\(\+\d{1,4}\)\d{4,15}$/;
    if (!phonePattern.test(val)) {
      phoneError.value = "Please enter a valid phone number";
      return false;
    }
    phoneError.value = "";
    return true;
  };

  const passwordError = ref("");
  const validatePassword = (val, mode) => {
    if (val === "") {
      passwordError.value = "Please enter your password";
      return false;
    }
    if (mode == SignupMode && !passwordStrengthRegex.test(val)) {
      passwordError.value =
        "Password must be at least 6 characters long and contain at least one letter and one number";
      return false;
    }

    passwordError.value = "";
    return true;
  };

  return {
    emailError,
    validateEmail,
    validatePhone,
    phoneError,
    passwordError,
    validatePassword,
  };
}
