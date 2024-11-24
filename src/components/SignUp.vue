<template>
  <div class="column q-pa-md">
    <div class="q-mb-sm text-h5 text-bold text-center">Sign up</div>
    <div class="row justify-center q-mb-sm q-gutter-md">
      <q-btn
        v-if="registerMode == Email"
        icon="phone_iphone"
        outline
        rounded
        dense
        @click="registerMode = Phone"
      />
      <q-btn
        v-if="registerMode == Phone"
        icon="mail"
        outline
        rounded
        dense
        @click="registerMode = Email"
      />
    </div>
    <div v-if="registerMode === Phone" class="text-center text-grey">
      or use mobile phone
    </div>
    <div v-if="registerMode === Email" class="text-center text-grey">
      or use email
    </div>
    <q-form class="q-gutter-sm q-px-lg" @submit="sendVerifyCode">
      <q-input
        v-if="registerMode == Email"
        v-model="email"
        type="email"
        :rules="[validateEmail]"
        :error="emailError !== ''"
        :error-message="emailError"
        label="Email"
      />
      <PhonenumberInput
        v-if="registerMode === Phone"
        :country-code="countryDailCode.countryCode"
        :country-dail-code="countryDailCode.countryDailCode"
        @update:model-value="getPhoneNumber"
      />
      <q-input
        v-model="password"
        :type="passwordVisiable ? 'text' : 'password'"
        :rules="[validatePassword]"
        :error="passwordError !== ''"
        :error-message="passwordError"
        label="Password"
      >
        <template v-slot:append>
          <q-btn
            :icon="passwordEyeIcon"
            tabindex="-1"
            flat
            dense
            @click="convertPasswordIcon('password')"
          />
        </template>
      </q-input>
      <q-input
        v-model="repassword"
        :type="repasswordVisiable ? 'text' : 'password'"
        :rules="[validateRepassword]"
        :error="repasswordError !== ''"
        :error-message="repasswordError"
        label="Password"
      >
        <template v-slot:append>
          <q-btn
            :icon="repasswordEyeIcon"
            tabindex="-1"
            flat
            dense
            @click="convertPasswordIcon('repassword')"
          />
        </template>
      </q-input>
      <div class="row justify-center">
        <q-btn
          class="q-mt-sm"
          type="submit"
          label="SIGN UP"
          rounded
          :loading="sendVerifyLoading"
          color="secondary"
        />
      </div>
      <div
        class="text-center text-grey cursor-pointer"
        @click="$emit('update-mode', SigninMode)"
      >
        Already hava an account? Go to Sign in.
      </div>
    </q-form>
    <VerificationDialog
      :show="isVerifyDialogShow"
      :mode="registerMode"
      :target="registerMode === Email ? email : phonenumber"
      :loading="sendVerifyLoading"
      :usage="SignupMode"
      :captcha-time="captchaTime"
      @disable-dialog="isVerifyDialogShow = false"
      @callback="signup"
    />
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { validator } from "src/composables/user";
import { computed, onMounted, ref } from "vue";
import { SigninMode, SignupMode, StatusOK } from "src/composables/consts";
import { countryCodeDialMap, tool } from "src/uril/tool";
import { getLocation } from "src/composables/user";
import { service } from "src/services/api";
import VerificationDialog from "./VerificationDialog.vue";
import { Email, Phone } from "src/composables/consts";
import PhonenumberInput from "./PhonenumberInput.vue";

defineOptions({
  name: "SignUp",
});

const porps = defineProps({
  mode: {
    type: String,
    required: true,
    default: "SIGNUP",
  },
});
const $q = useQuasar();
const emit = defineEmits(["update-mode"]);

const email = ref("");
const { emailError, validateEmail } = validator();
const phonenumber = ref("");
const password = ref("");
const { passwordError, validatePassword } = validator();
const passwordVisiable = ref(false);
const passwordEyeIcon = ref("visibility");
const repassword = ref("");
const repasswordError = ref("");
const repasswordVisiable = ref(false);
const repasswordEyeIcon = ref("visibility");
const registerMode = ref(Email);
const isVerifyDialogShow = ref(false);
const sendVerifyLoading = ref(false);
const captchaTime = ref(0);
const countryDailCode = ref({});

const validateRepassword = (val) => {
  if (val === "") {
    repasswordError.value = "Please enter your password again";
    return false;
  }
  if (val !== "" && val !== password.value) {
    repasswordError.value = "Password does not match";
    return false;
  }
  repasswordError.value = "";
  return true;
};

function getPhoneNumber(val) {
  phonenumber.value = val;
}

function convertPasswordIcon(type) {
  if (type == "password") {
    if (passwordEyeIcon.value == "visibility") {
      passwordEyeIcon.value = "visibility_off";
      passwordVisiable.value = true;
    } else {
      passwordEyeIcon.value = "visibility";
      passwordVisiable.value = false;
    }
  } else {
    if (repasswordEyeIcon.value == "visibility") {
      repasswordEyeIcon.value = "visibility_off";
      repasswordVisiable.value = true;
    } else {
      repasswordEyeIcon.value = "visibility";
      repasswordVisiable.value = false;
    }
  }
}

async function signup() {
  const body = { password: password.value };
  if (registerMode.value === Email) {
    body.email = email.value;
  } else {
    body.phone_number = phonenumber.value;
  }
  try {
    const response = await service.register(body);

    const data = response.data;
    if (!data.ok) {
      $q.notify({
        type: "negative",
        message: response.data.data.msg,
      });
    } else {
      $q.dialog({
        title: "Welcome",
        message: "You have successfully Signed in. Go to sign in.",
        persistent: true,
      }).onOk(() => {
        emit("update-mode", SigninMode);
      });
    }
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: "Something went wrong",
    });
  }
}

async function sendVerifyCode() {
  if (sendVerifyLoading.value) {
    return;
  }
  sendVerifyLoading.value = true;
  const body = {};
  if (registerMode.value === Email) {
    body.email = email.value;
  } else {
    body.phone_number = phonenumber.value;
  }

  try {
    const response = await service.sendSignupCaptcha(body);
    const data = response.data.data;
    captchaTime.value = data.created_at;
    isVerifyDialogShow.value = true;
  } catch (error) {
    console.log(error);

    $q.notify({
      type: "negative",
      message: "Something went wrong",
      position: "top",
    });
    console.log(error);
  }
  sendVerifyLoading.value = false;
}

onMounted(async () => {
  const ip = await tool.getIp();
  if (ip) {
    countryDailCode.value = await tool.getCode(ip);
  }
});
</script>

<style scoped></style>
