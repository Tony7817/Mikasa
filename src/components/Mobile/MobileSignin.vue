<template>
  <div>
    <q-form class="q-mx-lg" @submit="onSubmit">
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
        class="text-grey text-center forget-pass q-mt-md"
        @click="$emit('update-mode', ForgetPasswordMode)"
      >
        Forget your password?
      </div>
      <div class="row justify-center q-mb-sm q-gutter-lg q-mt-sm">
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
      <div class="row justify-center q-gutter-md q-mt-md">
        <q-btn
          label="Sign Up"
          no-caps
          rounded
          color="primary"
          @click="$emit('update-mode', SignupMode)"
        />
        <q-btn no-caps label="Sign In" type="submit" rounded color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import PhonenumberInput from "src/components/PhonenumberInput.vue";
import { setup } from "src/composables/signin";
import { tool } from "src/uril/tool";

const emit = defineEmits(["update-mode"])
const {
  signinMode,
  email,
  password,
  getPhoneNumber,
  Email,
  countryDialCode,
  Phone,
  SignupMode,
  onSubmit,
} = setup();


onMounted(async () => {
  const ip = await tool.getIp();
  if (ip) {
    countryDialCode.value = await tool.getCode(ip);
  }
});
</script>

<style lang="scss" scoped></style>
