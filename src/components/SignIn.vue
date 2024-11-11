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
import { Cookies, useQuasar } from "quasar";
import { userService } from "src/services/userService";
import { validateEmailx } from "src/composables/user";
import { ref } from "vue";
import { useUserStore } from "src/stores/user";
import { useRoute, useRouter } from "vue-router";

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
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

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
    const data = response.data.data;

    if (data.user_id) {
      userStore.setUser({
        id: data.user_id,
        name: data.name,
        token: data.accessToken,
      });
    }
    const redirectPath = route.query.next || "/";
    router.push(redirectPath);
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: "error",
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
