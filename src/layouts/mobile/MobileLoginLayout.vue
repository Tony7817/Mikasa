<template>
  <q-layout view="hhh Lpr fFf" class="gradient-background">
    <div class="header row q-pl-md q-pt-md">
      <q-btn icon="arrow_back" label="back" flat @click="router.go(-1)" />
    </div>

    <q-page-container>
      <q-page>
        <div class="column" style="height: 100vh">
          <div class="col-3" v-if="mode === SigninMode"></div>
          <MobileSignin class="col" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import MobileSignin from "src/components/Mobile/MobileSignin.vue";
import { SigninMode } from "src/composables/consts";
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
