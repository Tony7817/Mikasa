<template>
  <div class="q-pa-md gradient-background">
    <div class="row">
      <q-btn
        class="col-1"
        icon="arrow_back"
        dense
        flat
        @click="emit('update-mode', SigninMode)"
      />
      <div class="col-3"></div>
      <div class="q-mb-sm text-h5 text-bold text-center">Reset Password</div>
    </div>
    <div class="row justify-center q-gutter-md">
      <q-btn
        v-if="resetMode === Email"
        icon="phone_iphone"
        outline
        rounded
        dense
        @click="resetMode = Phone"
      />
      <q-btn
        v-if="resetMode === Phone"
        icon="email"
        outline
        rounded
        dense
        @click="resetMode = Email"
      />
    </div>
    <q-form class="q-gutter-md q-px-lg" @submit="sendVerifyCode">
      <q-input
        v-if="resetMode === Email"
        v-model="email"
        label="Email"
        :rules="[validateEmail]"
        :error="emailError !== ''"
        :error-message="emailError"
        type="email"
      />
      <PhonenumberInput
        v-if="resetMode === Phone"
        :country-code="countryDialCode.countryCode"
        :country-dail-code="countryDialCode.countryDailCode"
        @update:model-value="getPhoneNumber"
      />
      <q-input
        v-model="password"
        :rules="[validatePassword]"
        :error="passwordError !== ''"
        :error-message="passwordError"
        type="password"
        label="Password"
      />
      <q-input
        v-model="repassword"
        :rules="[validateRepassword]"
        :error="repasswordError !== ''"
        :error-message="repasswordError"
        type="password"
        label="Password"
      />
      <div class="row justify-center">
        <q-btn
          class="q-mt-sm"
          type="submit"
          label="send verification code"
          rounded
          :loading="resetLoading || sendVerifyLoading"
          color="primary"
        />
      </div>
      <div
        class="row justify-center q-mt-md"
        v-if="sendVerifyLoading || resetLoading"
      >
        <q-spinner size="3em" color="primary" />
      </div>
    </q-form>
    <DesktopVerificationDialog
      :show="isVerifyDialogShow"
      :mode="resetMode"
      :target="resetMode === Email ? email : phoneNumber"
      :captchaTime="captchaTime"
      :usage="ForgetPasswordMode"
      @disable-dialog="isVerifyDialogShow = false"
      @callback="reset"
    />
  </div>
</template>

<script setup>
import {
  Email,
  ForgetPasswordMode,
  Phone,
  SigninMode,
} from "src/composables/consts";
import { validator } from "src/composables/user";
import { onMounted, ref } from "vue";
import PhonenumberInput from "src/components/PhonenumberInput.vue";
import DesktopVerificationDialog from "src/components/Desktop/DesktopVerificationDialog.vue";
import { useQuasar } from "quasar";
import { service } from "src/services/api";
import { countryCodeDialMap } from "src/uril/tool";

const $q = useQuasar();
const emit = defineEmits(["update:mode"]);
const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
});

const email = ref("");
const { emailError, validateEmail } = validator();
const phoneNumber = ref("");
const password = ref("");
const repassword = ref("");
const { passwordError, validatePassword } = validator();
const resetMode = ref(Email);
const repasswordError = ref("");
const isVerifyDialogShow = ref(false);
const sendVerifyLoading = ref(false);
const captchaTime = ref(0);
const countryDialCode = ref({});
const resetLoading = ref(false);

const validateRepassword = (val) => {
  if (val === "") {
    repasswordError.value = "Please enter your password";
    return false;
  } else if (password.value !== "" && val !== password.value) {
    repasswordError.value = "Password does not match";
    return false;
  }
  repasswordError.value = "";
  return true;
};

function getPhoneNumber(val) {
  phoneNumber.value = val;
}

async function sendVerifyCode() {
  if (sendVerifyLoading.value) {
    return;
  }
  sendVerifyLoading.value = true;

  var body = {};
  if (resetMode.value === Email) {
    body.email = email.value;
  } else {
    body.phone_number = phoneNumber.value;
  }

  try {
    const response = await service.sendForgetPasswordCaptcha(body);
    const data = response.data.data;
    captchaTime.value = data.created_at;
    isVerifyDialogShow.value = true;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "something went wrong",
      position: "top",
    });
    console.log(error);
  }
  sendVerifyLoading.value = false;
}

async function reset() {
  if (resetLoading.value) {
    return;
  }

  resetLoading.value = true;

  try {
    var body = { password: password.value };
    if (resetMode.value === Email) {
      body.email = email.value;
    } else {
      body.phone_number = phoneNumber.value;
    }
    const response = await service.resetPassword(body);
    const data = response.data.data;
    if (data.ok) {
      $q.notify({
        type: "positive",
        message: "OK",
        position: "top",
      });
      emit("update-mode", SigninMode);
    } else {
      $q.notify({
        type: "negative",
        message: "something went wrong",
        position: "top",
      });
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "something went wrong",
      position: "top",
    });
  }

  resetLoading.value = false;
}

onMounted(() => {
  countryDialCode.value = {
    countryCode: countryCodeDialMap[0].countryCode,
    countryDailCode: countryCodeDialMap[0].dailCode,
  };
});
</script>

<style>
.gradient-background {
  background: linear-gradient(
    to bottom,
    #cb2a45,
    #2a4a82
  ); /* 从上到下的竖直渐变 */
}
</style>
