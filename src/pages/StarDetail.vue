<template>
  <q-page padding style="background-color: #f4f6f8">
    <div class="row" style="background-color: white">
      <div class="col-1 q-pa-sm">
        <q-img
          :src="starDetail.avatar"
          style="width: 80px; height: 80px"
          fit="contain"
        />
      </div>
      <div class="col">
        <div class="column q-pa-sm">
          <span class="text-h6">{{ starDetail.name }}</span>
          <span>{{ starDetail.description }}</span>
        </div>
      </div>
      <div class="self-center" style="width: 10%">
        <q-btn label="Follow" color="secondary" icon="add" />
      </div>
    </div>
    <!--Product list-->
    <div class="row q-mt-md">
      <div class="q-mr-sm" style="width: 15%">
        <q-card flat>
          <q-card-section>
            Twiter <a class="text-primary" href="">@Ruby</a>
          </q-card-section>
          <q-card-section>
            TikTok <a class="text-primary" href="">@Ruby</a>
          </q-card-section>
        </q-card>
      </div>
      <div class="col" style="background-color: white">
        <div class="row justify-center">
          <div class="row q-mt-sm q-pa-sm q-gutter-xl">
            <ProductItem
              class="q-mt-sm"
              v-for="p in products"
              :key="p.id"
              :id="p.id"
              :cover-url="p.cover_url"
              :description="p.description"
              :price="p.price"
              :unit="p.unit"
            />
          </div>
        </div>
        <div v-if="products.length > 20" class="row justify-center">
          <q-pagination v-model="currentPage" :max="9" direction-links />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ProductItem from "src/components/ProductItem.vue";
import { service } from "src/services/api";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";

defineOptions({
  name: "StarDetail",
});
const starDetail = ref({
  id: "",
  name: "",
  avatar: "",
  description: "",
});
const products = ref([]);
const size = 20;
const currentPage = ref(1);
const $q = useQuasar();
const route = useRoute();
const starId = route.params.id;

async function onLoadStarDetail() {
  try {
    const response = await service.getStarDetail(starId);
    starDetail.value = response.data.data;
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "nagetive",
      message: "wrong",
      position: "top",
    });
  }
}

async function onLoadProducts() {
  try {
    const response = await service.getProductList({
      star_id: starId,
      page: currentPage.value,
      size: size,
    });
    products.value = response.data.data.products;
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: "wrong",
      position: "top",
    });
  }
}

onMounted(() => {
  onLoadStarDetail();
  onLoadProducts();
});
</script>

<style></style>
