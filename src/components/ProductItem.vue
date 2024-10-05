<template>
  <div style="width: 274px">
    <q-img class="product-img" :src="props.link" fit="contain" />
    <div class="column q-mt-sm">
      <span>{{ props.desc }}</span>
      <span style="font-weight: bold">$3.85</span>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "ProductItem",
});

const props = defineProps({
  link: {
    type: String,
    default: "",
  },
  desc: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.product-img {
  width: 274px;
  height: 256px;
}
</style>
