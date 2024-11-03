<template>
  <div style="width: 250px">
    <router-link :to="`/star/${route.params.id}/product/${props.id}`">
      <q-img class="star-product-img" :src="props.coverUrl" fit="contain" />
    </router-link>
    <div class="column q-mt-sm q-px-sm">
      <span>{{ props.description }}</span>
      <span style="font-weight: bold; font-size: 20px">{{ price }}</span>
    </div>
  </div>
</template>

<script setup>
import { tool } from "src/uril/tool";
import { computed } from "vue";
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
  coverUrl: {
    type: String,
    default: "",
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  unit: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const price = computed(() => {
  return props.price + tool.getUnit(props.unit);
});
</script>

<style scoped></style>
