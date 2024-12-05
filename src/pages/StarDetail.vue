<template>
  <DesktopStarDetail :star-id="starId" v-if="!$isMobile" />
  <MobileStarDetail :star-id="starId" v-else />
</template>

<script setup>
import DesktopStarDetail from "src/pages/desktop/DesktopStarDetail.vue";
import MobileStarDetail from "src/pages/mobile/MobileStarDetail.vue";

const props = defineProps({
  starId: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
