<template>
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
</template>

<script setup>
import { ref } from 'vue';

const password = ref()
</script>

<style scoped></style>
