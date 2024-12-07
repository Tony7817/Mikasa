<template>
  <div class="column">
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
    <div v-if="registerMode === Phone" class="text-center">switch to email</div>
    <div v-if="registerMode === Email" class="text-center">switch to phone</div>
    <q-form class="q-gutter-sm q-px-lg" @submit="sendVerifyCode">
      <q-input
        v-if="registerMode == Email"
        v-model="email"
        color="white"
        type="email"
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
        color="white"
        :type="passwordVisiable ? 'text' : 'password'"
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
        color="white"
        :type="repasswordVisiable ? 'text' : 'password'"
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
      <div class="row justify-center" style="margin-top: 30px">
        <q-btn
          class="q-mt-sm"
          type="submit"
          label="SIGN UP"
          rounded
          :loading="sendVerifyLoading"
          color="primary"
        />
      </div>
      <div
        class="text-center cursor-pointer q-mt-lg"
        @click="$emit('update-mode', SigninMode)"
      >
        Already hava an account?
        <span style="text-decoration: underline">Go to Sign in.</span>
      </div>
    </q-form>
    <MobileVerificationDialog
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
import { Email, Phone } from "src/composables/consts";
import PhonenumberInput from "src/components/PhonenumberInput.vue";
import MobileVerificationDialog from "src/components/Mobile/MobileVerificationDialog.vue";

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
const { phoneError, validatePhone } = validator();
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

function validate() {
  if (registerMode.value === Email) {
    if (!validateEmail(email.value)) {
      $q.notify({
        type: "warning",
        message: emailError.value,
        position: "top",
      });
      return false;
    }
  } else {
    if (!validatePhone(phonenumber.value)) {
      $q.notify({
        type: "warning",
        message: phoneError.value,
        position: "top",
      });
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

  if (!validateRepassword(repassword.value)) {
    $q.notify({
      type: "warning",
      message: repasswordError.value,
      position: "top",
    });
    return false;
  }

  return true;
}

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
  if (!validate()) {
    return;
  }

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
  if (!validate()) {
    return;
  }
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
      message: error?.response?.data?.msg || "Something went wrong",
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

<style scoped>
.gradient-background {
  background: linear-gradient(
    to bottom,
    #cb2a45,
    #2a4a82
  ); /* 从上到下的竖直渐变 */
}
</style>
