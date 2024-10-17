<template>
  <div class="column q-pa-md">
    <div class="q-mb-sm text-h5 text-bold text-center">Sign in</div>
    <div class="row justify-center q-mb-sm q-gutter-md">
      <q-btn icon="fab fa-google" outline rounded dense />
      <q-btn icon="fab fa-facebook-f" outline rounded dense />
    </div>
    <div class="text-center q-mb-sm text-grey">or use your account</div>
    <q-form class="q-gutter-md q-px-lg" @submit="onSubmit">
      <q-input
        v-model="email"
        :rules="[validateEmail]"
        :error="emailError !== ''"
        :error-message="emailError"
        type="text"
        label="Email"
      />
      <q-input
        v-model="password"
        :rules="[validatePassword]"
        :error="passwordError !== ''"
        :error-message="passwordError"
        type="password"
        label="Password"
      />
      <div class="text-grey text-center forget-pass">Forget your password?</div>
      <div class="column items-center">
        <q-btn
          class="q-mb-md"
          label="SIGN IN"
          type="submit"
          rounded
          color="primary"
        />
        <q-btn
          label="SIGN UP"
          rounded
          color="secondary"
          @click="$emit('update-mode', 'SIGNUP')"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { userService } from "src/services/userService";
import { validateEmailx } from "src/composables/user";
import { ref } from "vue";
import { StatusOK } from "src/composables/consts";

defineOptions({
  name: "SignIn",
});

const props = defineProps({
  mode: {
    type: String,
    required: true,
    default: "SIGNIN",
  },
});

const emit = defineEmits(["update:mode"]);
const email = ref("");
const { emailError, validateEmail } = validateEmailx();
const password = ref("");
const passwordError = ref("");

const validatePassword = (val) => {
  if (val === "") {
    passwordError.value = "Please enter your password";
    return false;
  }

  passwordError.value = "";
  return true;
};

const $q = useQuasar();

async function onSubmit() {
  const formData = new FormData();
  formData.append("email", email.value);
  formData.append("password", password.value);

  try {
    const response = await userService.postFormData("user/login", formData);
    console.log(response);
  } catch (error) {
    console.log("errro: ", error);
    $q.notify({
      type: "negative",
      message: error.response.data.msg,
      position: "top",
    });
  }
}
</script>

<style scoped>
.forget-pass:hover {
  cursor: pointer;
}
</style>
