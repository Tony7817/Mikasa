<template>
  <q-layout view="hhh Lpr fFf" class="bg-grey-10">
    <div class="header row items-center q-px-md" style="height: 8vh">
      <div class="col-2">
        <q-btn
          flat
          icon="arrow_back"
          label="Back"
          color="white"
          @click="router.go(-1)"
        >
        </q-btn>
      </div>
      <div class="col text-center text-h6 text-bold">
        A Wonderful Sexy Lingerie Store With Stars
      </div>
      <div class="col-2"></div>
    </div>
    <q-separator />
    <q-page-container>
      <q-page>
        <div class="row justify-center items-center" style="padding-top: 15vh">
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
import SignIn from "src/components/Desktop/DesktopSignIn.vue";
import SignUp from "src/components/Desktop/SignUp.vue";
import {
  ForgetPasswordMode,
  SigninMode,
  SignupMode,
} from "src/composables/consts";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
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

.gradient-background-lr {
  background: linear-gradient(
    to right,
    #cb2a45,
    #2a4a82
  ); /* 从上到下的竖直渐变 */
}
</style>
