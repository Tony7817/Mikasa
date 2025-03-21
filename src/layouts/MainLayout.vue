<template>
  <MobileMainLayout v-if="isMobile" />
  <DesktopMainLayout v-else />
</template>

<script setup>
import DesktopMainLayout from "src/layouts/desktop/DesktopMainLayout.vue";
import MobileMainLayout from "src/layouts/mobile/MobileMainLayout.vue";
import { Platform } from "quasar";
import { useMeta } from "quasar";

const isMobile = Platform.is.mobile;
</script>

<style scoped>
.searchInput {
  width: 500px;
}

.gradient-linear {
  /* background-color: #9A3E56; */
  /* background-color: #f6f7fc; */
  background: linear-gradient(45deg, #cb2a45, #2a4a82);
}

.menu-font {
  font-family: Montserrat;
  font-size: 16px;
  cursor: pointer;
}

.menu-font.active {
  color: #8069f6;
}

.menu-font:hover {
  text-decoration: underline;
}
</style>
