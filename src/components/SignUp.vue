<template>
  <div class="column q-pa-md">
    <div class="q-mb-sm text-h5 text-bold text-center">Sign up</div>
    <q-form class="q-gutter-md q-px-lg" @submit="onSubmit">
      <q-input
        v-model="username"
        type="text"
        :rules="[validateUsername]"
        :error="usernameError !== ''"
        :error-message="usernameError"
        label="Username"
      />
      <q-input
        v-model="email"
        type="email"
        :rules="[validateEmail]"
        :error="emailError !== ''"
        :error-message="emailError"
        label="Email"
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
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { userService } from "src/services/userService";
import { validateEmailx } from "src/composables/user";
import { ref } from "vue";
import { SigninMode, StatusOK } from "src/composables/consts";

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

const username = ref("");
const usernameError = ref("");
const email = ref("");
const { emailError, validateEmail } = validateEmailx();
const password = ref("");
const passwordError = ref("");
const passwordVisiable = ref(false);
const passwordEyeIcon = ref("visibility");
const repassword = ref("");
const repasswordError = ref("");
const repasswordVisiable = ref(false);
const repasswordEyeIcon = ref("visibility");
const isDialogShow = ref(false);

const validateUsername = (val) => {
  if (val === "") {
    usernameError.value = "Please enter your username";
    return false;
  }
  usernameError.value = "";
  return true;
};

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

async function onSubmit() {
  var formData = new FormData();
  formData.append("username", username.value);
  formData.append("email", email.value);
  formData.append("password", password.value);
  try {
    const response = await userService.postFormData("/user/register", formData);
    if (response.data.msg != StatusOK) {
      $q.notify({
        type: "negative",
        message: response.data.msg,
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
</script>

<style scoped></style>
