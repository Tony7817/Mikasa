<template>
  <q-page padding style="padding-top: 0px">
    <div style="position: relative">
      <q-img
        :src="starDetail.poster_url"
        style="height: 40vh; width: 100%"
        fit="cover"
      />
      <q-img
        :src="starDetail.avatar"
        style="
          position: absolute;
          right: 3%;
          bottom: 10%;
          width: 80px;
          height: 80px;
        "
        fit="contain"
      />
    </div>
    <div class="row q-pa-md gradient-linear" style="height: 25vh">
      <div class="col-7">
        <div>
          <div class="row q-gutter-md">
            <div class="text-h6">{{ starDetail.name }}</div>
            <q-btn
              icon="fab fa-facebook-f"
              color="pink-5"
              flat
              rounded
              dense
              style="font-size: 13px"
            />
            <q-btn
              icon="fa-brands fa-twitter"
              color="pink-5"
              flat
              rounded
              dense
              style="font-size: 13px"
            />
            <q-btn
              icon="fa-brands fa-instagram"
              color="pink-5"
              flat
              rounded
              dense
              style="font-size: 13px"
            />
            <q-btn
              icon="fa-brands fa-tiktok"
              color="pink-5"
              flat
              rounded
              dense
              style="font-size: 13px"
            />
          </div>
          <div class="q-mt-md">{{ starDetail.description }}</div>
        </div>
      </div>
      <q-space />
      <div class="row col self-start justify-end q-gutter-md">
        <q-btn
          v-if="starId !== null"
          class="col-4"
          label="HomePage"
          outline
          icon="home"
          :to="`/star/${starIdFinal}`"
        />
        <q-btn class="col-4" label="Follow" outline icon="add" />
      </div>
    </div>
    <!--Product list-->
    <div class="q-mt-md">
      <div class="row">
        <div class="col">
          <div class="text-center text-h6 text-bold">Products</div>
          <div class="row">
            <div class="row q-mt-sm q-gutter-lg">
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
        </div>
        <div v-if="starId === null" class="col-2">
          <div class="text-h6 text-bold">Photos</div>
          <div></div>
        </div>
      </div>
      <div class="row justify-center">
        <q-pagination v-model="currentPage" :max="9" direction-links />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import ProductItem from "src/components/Desktop/ProductItem.vue";
import { service } from "src/services/api";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";

const props = defineProps({
  starId: {
    type: String,
    required: false,
    default: null,
  },
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
const starIdFinal = computed(() => {
  return props.starId !== null ? props.starId : route.params.id;
});

async function onLoadStarDetail() {
  try {
    const response = await service.getStarDetail(starIdFinal.value);
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

watch(starIdFinal, async () => {
  await onload();
});

async function onload() {
  onLoadStarDetail();
  onLoadProducts();
}

async function onLoadProducts() {
  try {
    const response = await service.getProductList({
      star_id: starIdFinal.value,
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
  onload();
});
</script>

<style scoped>
.gradient-linear {
  /* background-color: #9A3E56; */
  /* background-color: #f6f7fc; */
  background: linear-gradient(45deg, #424242, #000000);
}
</style>
