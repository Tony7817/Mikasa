<template>
  <MobileLoginLayout v-if="isMobile" />
  <DesktopLoginLayout v-else />
</template>

<script setup>
import DesktopLoginLayout from "./desktop/DesktopLoginLayout.vue";
import { Platform } from "quasar";
import MobileLoginLayout from "./mobile/MobileLoginLayout.vue";

const isMobile = Platform.is.mobile;
</script>

<style scoped></style>
