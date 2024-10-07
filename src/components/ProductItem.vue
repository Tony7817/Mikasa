<template>
  <div style="width: 250px">
    <router-link :to="`/star/${route.params.id}/product/${props.id}`">
      <q-img class="star-product-img" :src="props.link" fit="contain" />
    </router-link>
    <div class="column q-mt-sm q-px-sm">
      <span>{{ props.desc }}</span>
      <span style="font-weight: bold">$3.85</span>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

defineOptions({
  name: "ProductItem",
});

const route = useRoute();

const props = defineProps({
  id: {
    type: String,
    default: "",
    required: true,
  },
  link: {
    type: String,
    default: "",
    required: true,
  },
  desc: {
    type: String,
    default: "",
  },
});
</script>

<style scoped></style>
