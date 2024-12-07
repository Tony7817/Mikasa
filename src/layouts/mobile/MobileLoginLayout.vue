<template>
  <q-layout
    view="hhh Lpr fFf"
    class="gradient-background"
    style="height: 100vh; overflow: hidden"
  >
    <div class="header row q-pl-md q-pt-md" style="height: 10vh">
      <q-btn icon="arrow_back" label="back" flat @click="router.go(-1)" />
    </div>

    <q-page-container>
      <q-page>
        <div class="column" style="height: 90vh">
          <div class="col-3">
            <div
              class="column justify-center items-center text-h4 text-bold"
              style="height: 100%"
            >
              <span v-if="mode === SigninMode">SignIn</span>
              <span v-else>SignUp</span>
            </div>
          </div>
          <div class="col">
            <MobileSignin
              v-if="mode === SigninMode"
              class="col"
              @update-mode="mode = SignupMode"
            />
            <MobileSignup v-else class="col" @update-mode="mode = SigninMode" />
          </div>
          <div v-if="mode === SigninMode" class="col-1">
            <div
              class="text-center"
              style="font-size: 16px"
              @click="mode = SignupMode"
            >
              No Account?
              <span style="text-decoration: underline">Sign up</span>
            </div>
          </div>
          <div
            v-if="mode === SignupMode"
            class="text-center col-1"
            @click="mode = SigninMode"
            style="font-size: 16px"
          >
            Already hava an account?
            <span style="text-decoration: underline">Go to Sign in.</span>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import MobileSignin from "src/components/Mobile/MobileSignin.vue";
import MobileSignup from "src/components/Mobile/MobileSignup.vue";
import { SigninMode, SignupMode } from "src/composables/consts";
import { ref } from "vue";
import { useRouter } from "vue-router";

const mode = ref(SigninMode);
const router = useRouter();
</script>

<style lang="css" scoped>
.gradient-background {
  background: linear-gradient(
    to bottom,
    #cb2a45,
    #2a4a82
  ); /* 从上到下的竖直渐变 */
}
</style>
