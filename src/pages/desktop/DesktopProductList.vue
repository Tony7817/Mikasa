<template>
  <q-page padding>
    <div class="" style="margin: auto">
      <div v-if="!loading" class="row q-gutter-lg">
        <ProductItem
          class="q-pa-md"
          v-for="p in products.products"
          :key="p.id"
          :id="p.id"
          :cover-url="p.default_color.cover_url"
          :description="p.description"
          :price="p.default_color.price"
          :unit="p.default_color.unit"
        />
      </div>
      <div class="row q-gutter-lg" v-else>
        <q-skeleton
          class="q-pa-md"
          v-for="i in 10"
          :key="i"
          :width="isMobile ? '100%' : '256px'"
          height="300px"
        />
      </div>
    </div>
    <div class="row justify-center" v-if="products.total > 20">
      <q-pagination
        v-model="currentPage"
        :max="Math.ceil(products.total / 20)"
        direction-links
        flat
        color="grey"
        active-color="primary"
      />
    </div>
  </q-page>
</template>

<script setup>
import ProductItem from "src/components/Desktop/ProductItem.vue";
import { onMounted } from "vue";

import { ref } from "vue";
import { service } from "src/services/api";
import { merge } from "src/uril/tool";
import { Platform, useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { watch } from "vue";

const isMobile = Platform.is.mobile;
const products = ref({
  total: 0,
  products: [],
});
const loading = ref(false);
const currentPage = ref(1);
const $q = useQuasar();
const route = useRoute();
const router = useRouter();

watch(currentPage, (newPage) => {
  router.push({ query: { page: newPage } });
  onLoad(newPage);
});

async function onLoad(reqPage) {
  if (loading.value) {
    return true;
  }

  loading.value = true;

  try {
    const response = await service.getProductList({
      page: reqPage,
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
  onLoad(route.query.page || 1);
});
</script>

<style lang="scss" scoped></style>
