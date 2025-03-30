<template>
  <DesktopUserDetail v-if="!isMobile" />
  <MobileUserInfo v-else />
</template>

<script setup>
import { Platform } from "quasar";
import MobileUserInfo from "./mobile/manage/MobileUserDetail.vue";
import DesktopUserDetail from "./desktop/manage/DesktopUserDetail.vue";

const isMobile = Platform.is.mobile;
</script>

<style lang="scss" scoped></style>
