<template>
  <q-page padding>
    <div class="row q-gutter-lg" style="margin: auto">
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

import { ref } from "vue";
import { service } from "src/services/api";
import { merge } from "src/uril/tool";
import { useQuasar } from "quasar";

const products = ref({
  total: 0,
  products: [],
});
const loading = ref(false);
const currentPage = ref(1);
const $q = useQuasar();

async function onLoad() {
  if (loading.value) {
    return true;
  }

  loading.value = true;

  try {
    const response = await service.getProductList({
      page: currentPage.value,
      page_size: 20,
    });
    const data = response.data.data;
    merge(products.value, data);
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "something went wrong",
      position: "top",
    });
  }

  loading.value = false;
}

onMounted(() => {
  onLoad();
});
</script>

<style lang="scss" scoped></style>
