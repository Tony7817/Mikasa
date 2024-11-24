import { service } from "src/services/api";
import { ref } from "vue";

export async function getLocation(ip) {
  const key = "be62fa1ff16346b9f29fa6675e9668f5";
  const api = "http://api.ipstack.com/" + ip + "?access_key=" + key;

  try {
    const response = await fetch(api, {
      method: "GET",
    });
    const data = response.json();
    console.log(data);
    return data.country_code;
  } catch (error) {
    console.log(error);
    return "";
  }
}

export function validator() {
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
    const phonePattern = /^\+?[1-9]\d{1,14}$/;
    if (!phonePattern.test(val)) {
      phoneError.value = "Please enter a valid phone number";
      return false;
    }
    phoneError.value = "";
    return true;
  };

  const passwordError = ref("");
  const validatePassword = (val) => {
    if (val === "") {
      passwordError.value = "Please enter your password";
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
