<template>
  <div class="column q-pa-md gradient-background">
    <div class="q-mb-sm text-h5 text-bold text-center">Sign in</div>
    <div class="row justify-center q-mb-sm q-gutter-md">
      <q-btn icon="fab fa-google" outline rounded dense />
      <q-btn icon="fab fa-facebook-f" outline rounded dense />
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
        autocomplete="on"
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
import { onMounted } from "vue";
import { tool } from "src/uril/tool";
import { setup } from "src/composables/signin";
import PhonenumberInput from "src/components/PhonenumberInput.vue";

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
} = setup();

onMounted(async () => {
  const ip = await tool.getIp();
  if (ip) {
    countryDialCode.value = await tool.getCode(ip);
  }
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
