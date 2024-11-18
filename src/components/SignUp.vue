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
      or use email
    </div>
    <div v-if="registerMode === Email" class="text-center text-grey">
      or use mobile phone
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
      <q-input
        v-if="registerMode == Phone"
        v-model="phonenumber"
        type="text"
        :rules="[validatePhone]"
        :error="phoneError !== ''"
        :error-message="phoneError"
        placeholder="Phone number"
      >
        <template v-slot:prepend>
          <div class="row">
            <span style="font-size: 16px">
              {{ countryCode }} {{ countryDailCode }}
            </span>
            <q-menu>
              <q-list style="max-width: 100px">
                <q-item
                  v-for="c in countryCodeDialMap"
                  :key="c.countryCode"
                  clickable
                  v-close-popup
                  @click="changeCountryCode(c)"
                >
                  <q-item-section>
                    {{ c.countryCode }} {{ c.dailCode }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-separator />
          </div>
        </template>
      </q-input>
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
      :target="registerMode === Email ? email : phonenumberWithCountryCode"
      :country-dial-code="countryDailCode"
      :loading="sendVerifyLoading"
      @disable-dialog="isVerifyDialogShow = false"
      @signup="signup"
    />
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { validator } from "src/composables/user";
import { computed, onMounted, ref } from "vue";
import { SigninMode, StatusOK } from "src/composables/consts";
import { countryCodeDialMap } from "src/uril/tool";
import { getLocation } from "src/composables/user";
import { service } from "src/services/api";
import VerificationDialog from "./VerificationDialog.vue";
import { Email, Phone } from "src/composables/consts";

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
const countryCode = ref("");
const countryDailCode = ref("");
const { phoneError, validatePhone } = validator();
const password = ref("");
const passwordError = ref("");
const passwordVisiable = ref(false);
const passwordEyeIcon = ref("visibility");
const repassword = ref("");
const repasswordError = ref("");
const repasswordVisiable = ref(false);
const repasswordEyeIcon = ref("visibility");
const registerMode = ref(Email);
const isVerifyDialogShow = ref(false);
const sendVerifyLoading = ref(false);

const validateRepassword = (val) => {
  if (val === "") {
    repasswordError.value = "Please enter your password again";
    return false;
  }
  repasswordError.value = "";
  return true;
};

const validatePassword = (val) => {
  if (val === "") {
    passwordError.value = "Please enter your password";
    return false;
  } else if (repassword.value !== "" && val !== repassword.value) {
    passwordError.value = "Password does not match";
    return false;
  }
  passwordError.value = "";
  return true;
};

const phonenumberWithCountryCode = computed(() => {
  return `(${countryDailCode.value})${phonenumber.value}`;
});

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
  const data = { password: password.value };
  if (registerMode.value === Email) {
    data.email = email.value;
  } else {
    data.phone_number = phonenumberWithCountryCode.value;
  }
  try {
    const response = await service.register(data);
    if (response.data.status != StatusOK) {
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

function changeCountryCode(c) {
  countryCode.value = c.countryCode;
  countryDailCode.value = c.dailCode;
}

async function getIp() {
  try {
    const response = await service.getIp();
    console.log(response);
    return response.data.data.ip;
  } catch (error) {
    console.log(error);
    return "";
  }
}

async function getCode(ip) {
  try {
    // const data = await getLocation(ip);
    countryCode.value = data.country_code;
    countryDailCode.value = data.calling_code;
    const idx = countryCodeDialMap.find((item) => {
      item.countryCode === countryCode.value;
      item.dailCode === countryCode.value;
    });
    if (idx === -1) {
      countryCode.value = countryCodeDialMap[0].countryCode;
      countryCode.value = countryCodeDialMap[0].dailCode;
    }
  } catch (error) {
    countryCode.value = countryCodeDialMap[0].countryCode;
    countryDailCode.value = countryCodeDialMap[0].dailCode;
    console.log(error);
  }
}

async function sendVerifyCode() {
  if (sendVerifyLoading.value) {
    return;
  }
  sendVerifyLoading.value = true;
  const data = {};
  if (registerMode.value === Email) {
    data.email = email.value;
  } else {
    data.phone_number = phonenumberWithCountryCode.value;
  }

  try {
    const response = await service.sendCaptcha(data);
    console.log(response);
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Something went wrong",
      position: "top",
    });
    console.log(error);
  }
  isVerifyDialogShow.value = true;
  sendVerifyLoading.value = false;
}

onMounted(async () => {
  const ip = await getIp();
  if (ip) {
    await getCode(ip);
  }
});
</script>

<style scoped></style>
