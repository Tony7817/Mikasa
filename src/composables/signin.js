import { useQuasar } from "quasar";
import { validator } from "src/composables/user";
import { ref } from "vue";
import { useUserStore } from "src/stores/user";
import { useRoute, useRouter } from "vue-router";
import { service } from "src/services/api";
import {
  Email,
  ForgetPasswordMode,
  Phone,
  SigninMode,
  SignupMode,
} from "src/composables/consts";

export function setup() {
  const $q = useQuasar();
  const router = useRouter();
  const route = useRoute();

  const email = ref("");
  const { emailError, validateEmail } = validator();
  const password = ref("");
  const { passwordError, validatePassword } = validator();
  const { phoneError, validatePhone } = validator();
  const userStore = useUserStore();
  const signinMode = ref(Email);
  const phoneNumber = ref("");
  const countryDialCode = ref({});
  const loading = ref(false);
  async function onSubmit() {
    if (loading.value) {
      return;
    }

    loading.value = true;

    if (!validate()) {
      return;
    }
    try {
      const body = { password: password.value };
      if (signinMode.value === Email) {
        body.email = email.value;
      } else {
        body.phone_number = phoneNumber.value;
      }
      const response = await service.signin(body);
      const data = response.data.data;

      if (data.user_id) {
        userStore.setUser({
          id: data.user_id,
          name: data.name,
          token: data.access_token,
          avatarUrl: data.avatar_url,
        });
      }
      const redirectPath = route.query.next || "/";
      router.push(redirectPath);
    } catch (error) {
      console.log(error);
      $q.notify({
        type: "negative",
        message: error?.response?.data?.msg || "Login failed",
        position: "top",
      });
    }

    loading.value = false;
  }

  function validate() {
    if (signinMode.value === Email) {
      if (!validateEmail(email.value)) {
        $q.notify({
          type: "warning",
          message: emailError.value,
          position: "top",
        });
        return false;
      }
    } else {
      if (!validatePhone(phoneNumber.value)) {
        $q.notify({
          type: "warning",
          message: phoneError.value,
          position: "top",
        });
        return false;
      }
    }
    if (!validatePassword(password.value, SigninMode)) {
      $q.notify({
        type: "warning",
        message: passwordError.value,
        position: "top",
      });
      return false;
    }

    return true;
  }

  function getPhoneNumber(val) {
    phoneNumber.value = val;
  }

  return {
    Email,
    ForgetPasswordMode,
    Phone,
    SigninMode,
    SignupMode,
    $q,
    router,
    route,
    email,
    emailError,
    validateEmail,
    password,
    passwordError,
    validatePassword,
    phoneError,
    validatePhone,
    signinMode,
    phoneNumber,
    onSubmit,
    getPhoneNumber,
    countryDialCode,
    loading,
  };
}
