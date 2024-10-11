<template>
  <div class="column q-pa-md">
    <div class="q-mb-sm text-h5 text-bold text-center">Sign up</div>
    <q-form class="q-gutter-md q-px-lg">
      <q-input label="Username" />
      <q-input label="Email" />
      <q-input label="Password" />
      <q-input label="Password" />
      <div class="row justify-center">
        <q-btn class="q-mt-sm" label="SIGN UP" rounded color="secondary" />
      </div>
      <div
        class="text-center text-grey cursor-pointer"
        @click="$emit('update-mode', 'SIGNIN')"
      >
        Already hava an account? Go to Sign in.
      </div>
    </q-form>
  </div>
</template>

<script setup>
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
</script>

<style scoped></style>
