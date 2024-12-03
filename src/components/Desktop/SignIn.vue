<template>
  <div class="column q-pa-md gradient-background">
    <div class="q-mb-sm text-h5 text-bold text-center">Sign in</div>
    <div class="row justify-center q-mb-sm q-gutter-md">
      <q-btn icon="fab fa-google" outline rounded dense />
      <q-btn icon="fab fa-facebook-f" outline rounded dense />
      <q-btn
        icon="phone_iphone"
        outline
        rounded
        dense
        @click="signinMode = Phone"
      />
    </div>
    <div class="text-center q-mb-sm">or use your account</div>
    <q-form class="q-gutter-md q-px-lg" @submit="onSubmit">
      <q-input
        class="cus-input"
        v-if="signinMode === Email"
        v-model="email"
        color="white"
        type="text"
        label="Email"
      />
      <PhonenumberInput
        v-if="signinMode === Phone"
        :country-code="countryDialCode.countryCode"
        :country-dail-code="countryDialCode.countryDailCode"
        @update:model-value="getPhoneNumber"
      />
      <q-input
        v-model="password"
        color="white"
        type="password"
        label="Password"
      />
      <div
        class="text-grey text-center forget-pass"
        @click="$emit('update-mode', ForgetPasswordMode)"
      >
        Forget your password?
      </div>
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
          color="primary"
          @click="$emit('update-mode', SignupMode)"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { validator } from "src/composables/user";
import { onMounted, ref } from "vue";
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
import PhonenumberInput from "./PhonenumberInput.vue";
import { tool } from "src/uril/tool";

defineOptions({
  name: "SignIn",
});

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:mode"]);
const email = ref("");
const { emailError, validateEmail } = validator();
const password = ref("");
const { passwordError, validatePassword } = validator();
const { phoneError, validatePhone } = validator();
const userStore = useUserStore();
const signinMode = ref(Email);
const countryDialCode = ref({});
const phoneNumber = ref("");

async function onSubmit() {
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
    const response = await service.login(body);
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
      message: error?.response?.data?.msg || "Login failed",
      position: "top",
    });
  }
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
  if (!validatePassword(password.value)) {
    $q.notify({
      type: "warning",
      message: passwordError.value,
      position: "top",
    });
    return false;
  }

  return true;
}

onMounted(async () => {
  const ip = await tool.getIp();
  if (ip) {
    countryDialCode.value = await tool.getCode(ip);
  }
});

function getPhoneNumber(val) {
  phoneNumber.value = val;
}
</script>

<style scoped>
.forget-pass:hover {
  cursor: pointer;
}

.gradient-background {
  background: linear-gradient(
    to bottom,
    #cb2a45,
    #2a4a82
  ); /* 从上到下的竖直渐变 */
}

.q-form .q-field .q-field--highlighted .q-field__labe {
  color: white;
}
</style>
