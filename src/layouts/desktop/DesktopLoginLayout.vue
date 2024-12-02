<template>
  <q-layout view="hhh Lpr fFf" style="background-color: #f6f6f6">
    <q-page-container>
      <q-page>
        <div class="row justify-center items-center" style="height: 100vh">
          <q-card style="width: 60%">
            <q-card-section style="padding: 0px">
              <div class="row">
                <!--Left Side-->
                <div
                  class="col-4 column justify-center items-center gradient-background"
                >
                  <div class="text-h4 text-white text-bold">Welcome</div>
                </div>
                <!--Right Side-->
                <SignIn
                  v-if="mode == SigninMode"
                  class="col-8"
                  :mode="mode"
                  @update-mode="mode = $event"
                />
                <SignUp
                  v-else-if="mode == SignupMode"
                  class="col-8"
                  :mode="mode"
                  @update-mode="mode = $event"
                />
                <ForgetPassword
                  v-else-if="mode === ForgetPasswordMode"
                  class="col-8"
                  :mode="mode"
                  @update-mode="mode = $event"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ForgetPassword from "src/components/Desktop/ForgetPassword.vue";
import SignIn from "src/components/Desktop/SignIn.vue";
import SignUp from "src/components/Desktop/SignUp.vue";
import {
  ForgetPasswordMode,
  SigninMode,
  SignupMode,
} from "src/composables/consts";
import { ref } from "vue";

const mode = ref(SigninMode);
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
