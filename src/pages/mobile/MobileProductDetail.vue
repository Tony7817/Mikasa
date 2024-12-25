<template>
  <q-page>
    <div>
      <q-img :src="selectedImage" style="height: 60vh" />
    </div>
    <div class="row q-gutter-md q-mt-xs q-ml-xs">
      <div v-for="img in selectedColor.images" :key="img">
        <q-avatar
          :size="img === selectedImage ? '60px' : '50px'"
          @click="selectedImage = img"
        >
          <q-img :src="img" />
        </q-avatar>
      </div>
    </div>
    <div class="text-primary text-h5 text-bold q-ml-md q-mt-sm">
      <span class="text-h6">{{ tool.getUnit(product.unit) }} </span
      >{{ product.price }}
    </div>
    <div class="q-ml-md" style="font-size: 16px">
      {{ product.description }}
    </div>
    <div class="row q-ml-md q-mt-md items-center">
      <q-btn
        label="Add to Cart"
        color="primary"
        no-caps
        dense
        style="width: 100px"
        @click="AddProduct"
      />
      <q-btn
        class="q-ml-md"
        label="Buy Now"
        color="primary"
        no-caps
        dense
        style="width: 100px"
        @click="Buy"
      />
      <div
        v-if="selectedSize != ''"
        class="text-primary q-ml-md"
        style="font-size: 16px"
      >
        Selected {{ selectedSize }}
      </div>
    </div>
    <q-separator class="q-my-md q-mx-md" />
    <div class="q-ml-md q-pb-lg" style="font-size: 16px">
      {{ product.detail }}
    </div>
    <q-dialog v-model="isDialogShow" full-width square>
      <q-card class="bg-grey-10" square>
        <q-card-section>
          <q-btn icon="arrow_back" color="primary" flat dense />
          <span style="font-size: 16px"> Pick your size </span>
        </q-card-section>
        <q-card-section>
          <SizePicker v-model="selectedSizeTmp" :size="product.size" />
        </q-card-section>
        <q-card-section>
          <div class="row" style="font-size: 20px">
            <div class="col-2"></div>
            <q-btn label="cancel" color="primary" @click="cancelDialog" />
            <q-space />
            <q-btn label="ok" color="primary" @click="selectOK" />
            <div class="col-2"></div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import SizePicker from "src/components/Desktop/SizePicker.vue";
import { computed, onMounted, ref } from "vue";
import { tool } from "src/uril/tool";
import { useRouter, useRoute } from "vue-router";
import { service } from "src/services/api";
import { useUserStore } from "src/stores/user";
import _ from "lodash";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const selectedSize = ref("");
const productId = route.params.productId;
const selectedColor = ref({});
const selectedImage = ref("");
const loadingAddCart = ref(false);
const userStore = useUserStore();
const product = ref({
  id: "",
  price: 0,
  unit: "",
  description: "",
  color: {},
  rating: 0,
  color_list: [],
  rate_count: 0,
  sold_num: 0,
});

const rating = computed(() => {
  return product.value.rate ? product.value.rate : 0;
});

async function onLoadProduct() {
  try {
    const response = await service.getProductDetail(productId, {});
    const data = response.data.data;
    _.assign(product.value, data);
    console.log(product.value.color);
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: "Something went wrong",
      position: "top",
    });
  }
}

async function addToCart() {
  if (loadingAddCart.value) {
    return;
  }
  if (!selectedSize.value) {
    $q.notify({
      type: "negative",
      message: "Please select your size",
      position: "top",
    });
    return;
  }

  loadingAddCart.value = true;

  try {
    const response = await service.addProductToCart(product.value.id, {
      size: selectedSize.value,
    });
    const status = response.data.code;
    if (status === 200) {
      $q.notify({
        type: "positive",
        message: "success",
        position: "top",
      });
    }
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: "Something went wrong",
      position: "top",
    });
  }

  loadingAddCart.value = false;
}

onMounted(() => {
  onLoadProduct();
});
</script>

<style lang="scss" scoped>
.selected-img {
  border: 1px solid $primary;
}
</style>
