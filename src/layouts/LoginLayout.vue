<template>
  <MobileLoginLayout v-if="isMobile" />
  <DesktopLoginLayout v-else />
</template>

<script setup>
import DesktopLoginLayout from "src/layouts/desktop/DesktopLoginLayout.vue";
import { Platform } from "quasar";
import MobileLoginLayout from "src/layouts/mobile/MobileLoginLayout.vue";

const isMobile = Platform.is.mobile;
</script>

<style scoped></style>
