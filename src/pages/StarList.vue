<template>
  <DesktopStarList v-if="!$isMobile" />
  <MobileStarList v-else />
</template>

<script setup>
import DesktopStarList from "src/pages/desktop/DesktopStarList.vue";
import MobileStarList from "src/pages/mobile/MobileStarList.vue";
</script>

<style scoped></style>
