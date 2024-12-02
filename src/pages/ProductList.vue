<template>
  <DesktopProductList v-if="!$isMobile" />
  <MobildProductList v-else />
</template>

<script setup>
import MobildProductList from "src/pages/mobile/MobildProductList.vue";
import DesktopProductList from "src/pages//desktop/DesktopProductList.vue";

defineOptions({
  name: "ProductList",
});

</script>

<style scoped>
.text-indent {
  text-indent: 1em;
}

.link-hover:hover {
  color: #cb2a45;
  cursor: pointer;
}
</style>
