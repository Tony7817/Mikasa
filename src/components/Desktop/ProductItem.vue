<template>
  <div style="width: 250px">
    <div>
      <router-link :to="`/product/${props.id}`">
        <q-img class="star-product-img" :src="props.coverUrl" fit="cover" />
      </router-link>
      <div
        class="column q-mt-sm q-px-sm"
        style="word-wrap: break-word; cursor: pointer"
        @click="toProductPage"
      >
        <span class="text-none-style">{{ props.description }}</span>
        <span class="text-primary text-bold" style="font-size: 20px">{{
          price
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { tool } from "src/uril/tool";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "ProductItem",
});

const route = useRoute();
const router = useRouter();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  coverUrl: {
    type: String,
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

function toProductPage() {
  router.push(`/star/${route.params.id}/product/${props.id}`);
}
</script>

<style scoped>
.text-none-style {
  text-decoration: none;
}
</style>
