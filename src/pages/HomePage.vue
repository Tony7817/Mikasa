<template>
  <DesktopHomePage v-if="!$isMobile" />
  <MobileHomePage v-else />
</template>

<script setup>
import DesktopHomePage from "src/pages/desktop/DesktopHomePage.vue";
import MobileHomePage from "src/pages/mobile/MobileHomePage.vue";
</script>

<style lang="css" scoped></style>
