<template>
  <MobileContactPage v-if="$isMobile" />
  <DesktopContactPage v-else />
</template>

<script setup>
import DesktopContactPage from "src/pages/desktop/DesktopContactPage.vue";
import MobileContactPage from "src/pages/mobile/MobileContactPage.vue";
</script>

<style lang="scss" scoped></style>
