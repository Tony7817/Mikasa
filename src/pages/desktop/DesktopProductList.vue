<template>
  <q-page padding>
    <div class="row q-gutter-lg justify-center">
      <ProductItem
        class="q-mt-sm"
        v-for="p in products.products"
        :key="p.id"
        :id="p.id"
        :cover-url="p.cover_url"
        :description="p.description"
        :price="p.price"
        :unit="p.unit"
      />
    </div>
  </q-page>
</template>

<script setup>
import ProductItem from "src/components/Desktop/ProductItem.vue";
import { setup } from "src/composables/ProductList";
import { onMounted } from "vue";

const { products, onLoad } = setup();

onMounted(() => {
  onLoad();
});
</script>

<style lang="scss" scoped></style>
