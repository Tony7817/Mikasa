<template>
  <q-page>
    <MobileStarDetail />
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import MobileStarDetail from "./MobileStarDetail.vue";

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
  poster_url: "",
  products: [],
});

const size = 20;

async function onLoadStarDetail() {
  try {
    const response = await service.getStarDetail(props.starId);
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
      star_id: starIdFinal.value,
      page: currentPage.value,
      size: size,
    });
    starDetail.value.products = response.data.data.products;
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

<style lang="css" scoped></style>
