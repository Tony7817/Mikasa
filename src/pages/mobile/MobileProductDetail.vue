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
import SizePicker from "src/components/Desktop/SizePicker.vue";
import { BuyNow } from "src/composables/consts";
import { setup } from "src/composables/ProductDetail";
import { tool } from "src/uril/tool";
import { onMounted, ref } from "vue";

const {
  selectedSize,
  selectedImage,
  selectedColor,
  loadingAddCart,
  product,
  rating,
  userStore,
  router,
  $q,
  onLoadProduct,
  addToCart,
} = setup();
const isDialogShow = ref(false);
const selectedSizeTmp = ref("");

function cancelDialog() {
  selectedSize.value = "";
  isDialogShow.value = false;
}

async function selectOK(mode) {
  selectedSize.value = selectedSizeTmp.value;
  if (mode === BuyNow) {
  } else {
    await addToCart();
  }
}

async function AddProduct() {
  if (!userStore.isAuthenticated) {
    router.push(`/login`);
  }
  if (selectedSize.value !== "") {
    await addToCart();
  } else {
    isDialogShow.value = true;
  }
}

async function Buy() {
  if (!userStore.isAuthenticated) {
    router.push(`/login`);
  }

  isDialogShow.value = true;
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
