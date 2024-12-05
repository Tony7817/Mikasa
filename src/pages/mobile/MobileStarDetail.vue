<template>
  <q-page>
    <div>
      <q-img :src="starDetail.poster_url" style="height: 10vh" />
    </div>
    <div>
      <div class="row justify-center" style="margin-top: -13px">
        <q-avatar>
          <q-img :src="starDetail.avatar" />
        </q-avatar>
      </div>
      <div class="text-center text-h5">{{ starDetail.name }}</div>
      <div
        class="row justify-center items-center q-gutter-md q-mb-md"
        style="margin-top: 1px"
      >
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
      <q-card bordered dark flat class="q-mx-md bg-grey-10">
        <q-card-section>
          {{ starDetail.description }}
        </q-card-section>
      </q-card>
    </div>
    <div>
      <div class="text-center text-h5 text-bold q-my-sm">Products</div>
      <q-infinite-scroll>
        <div class="product-grid">
          <div v-for="p in products" :key="p.id">
            <div class="">
              <q-img :src="p.cover_url" fit="cover" style="height: 30vh" />
            </div>
          </div>
        </div>
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { service } from "src/services/api";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const starId = ref(route.params.id);
const $q = useQuasar();

const starDetail = ref({
  id: "",
  name: "",
  avatar: "",
  description: "",
  poster_url: "",
});
const currentPage = ref(1);
const products = ref([]);

const size = 20;

async function onLoadStarDetail() {
  try {
    const response = await service.getStarDetail(starId.value);
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
      star_id: starId.value,
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

async function onload() {
  onLoadStarDetail();
  onLoadProducts();
}

onMounted(() => {
  onload();
});
</script>

<style lang="scss" scoped>
.product-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, 20vh);
  justify-content: center;
}
</style>
