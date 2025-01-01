<template>
  <div class="column q-pa-md gradient-background">
    <div class="q-mb-sm text-h5 text-bold text-center q-mb-md">Sign in</div>
    <div class="row justify-center q-gutter-md">
      <q-btn
        v-if="signinMode === Email"
        icon="phone_iphone"
        outline
        rounded
        dense
        @click="signinMode = Phone"
      />
      <q-btn
        v-if="signinMode === Phone"
        icon="email"
        outline
        rounded
        dense
        @click="signinMode = Email"
      />
    </div>
    <q-form class="q-px-lg" @submit="onSubmit">
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
        autocomplete="on"
        label="Password"
      />
      <div class="row justify-center items-center q-gutter-lg q-mt-xs">
        <q-btn
          label="SIGN UP"
          rounded
          color="primary"
          @click="$emit('update-mode', SignupMode)"
        />
        <q-btn label="SIGN IN" type="submit" rounded color="primary" :loading="loading" />
      </div>
      <div class="row justify-center q-mt-lg">
        <google-signin :mode="SigninMode"></google-signin>
      </div>
      <div
        class="text-grey text-center q-mb-md q-mt-md"
        @click="$emit('update-mode', ForgetPasswordMode)"
      >
        Forget your password?
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { countryCodeDialMap, tool } from "src/uril/tool";
import { setup } from "src/composables/signin";
import PhonenumberInput from "src/components/PhonenumberInput.vue";
import GoogleSignin from "src/components/GoogleSignin.vue";
import { ForgetPasswordMode, SigninMode } from "src/composables/consts";

const emit = defineEmits(["update-mode"]);
const {
  signinMode,
  Email,
  Phone,
  onSubmit,
  email,
  phoneNumber,
  password,
  SignupMode,
  countryDialCode,
  getPhoneNumber,
  loading,
} = setup();

onMounted(async () => {
  // const ip = await tool.getIp();
  // if (ip) {
  //   countryDialCode.value = await tool.getCode(ip);
  // }
  countryDialCode.value = {
    countryCode: countryCodeDialMap[0].countryCode,
    countryDailCode: countryCodeDialMap[0].dailCode,
  };
});
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
