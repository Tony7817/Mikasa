<template>
  <DesktopProductDetail v-if="!$isMobile" />
  <MobileProductDetail v-else />
</template>

<script setup>
import DesktopProductDetail from "src/pages/desktop/DesktopProductDetail.vue";
import MobileProductDetail from "src/pages/mobile/MobileProductDetail.vue";
</script>

<style scoped></style>
