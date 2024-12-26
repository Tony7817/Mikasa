<template>
  <q-page>
    <div class="row">
      <div class="col-4 q-pa-md">
        <div>
          <q-img :src="selectedImage" class="product-img" fit="cover" />
        </div>
        <div class="row q-mt-sm q-gutter-x-sm">
          <div v-for="i in selectedColor.images" :key="i">
            <q-img
              :src="i"
              class="product-img-children"
              fit="cover"
              height="85px"
              @click="selectedImage = i"
            />
          </div>
        </div>
      </div>
      <div class="col-6 gradient-linear column">
        <div class="text-h5 q-mt-md" style="position: relative">
          {{ product.description }}
        </div>
        <!-- <div class="row">
          <q-chip color="primary" class="q-mt-sm" label="vedio link" icon="live_tv" square />
        </div> -->
        <div class="row q-gutter-x-md q-mt-xs items-center">
          <q-rating
            v-model="rating"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
            size="2em"
            disable
            color-selected="pink"
            color-half="pink"
          />
          <span
            v-if="product.rate"
            class="q-mt-xs q-ml-sm"
            style="font-size: 18px; margin-bottom: 2px"
            >{{ product.rate }}</span
          >
          <span class="q-mt-xs q-ml-md text-primary text-bold"
            >{{ product.rate_count }} ratings</span
          >
          <span class="q-mt-xs q-ml-md text-primary text-bold"
            >{{ product.sold_num }} sold</span
          >
          <q-space />
          <q-icon
            name="favorite_outlined"
            class="text-primary"
            style="font-size: 22px"
          />
        </div>
        <q-separator class="q-mb-md q-mt-sm" />
        <div class="q-ml-sm">
          <div class="row q-gutter-md">
            <div v-for="color in product.color_list" :key="color.color_id">
              <div
                class="q-mb-md"
                style="width: 80px; height: 80px; border-radius: 50%"
                :style="{ backgroundColor: color.color }"
                @click="selectedColor = color"
              >
                <q-img :src="color.cover_url" />
              </div>
            </div>
            <qimg />
          </div>
          <div class="row items-center">
            <span class="text-bold title">Price</span
            ><span
              class="q-ml-sm text-h6 text-bold text-primary"
              style="font-size: 25px"
              >{{ selectedColor.price
              }}{{ tool.getUnit(selectedColor.unit) }}</span
            >
          </div>
        </div>
        <div class="row q-mt-sm items-center">
          <div class="q-ml-sm text-bold text-h7 title">Size</div>
          <SizePicker v-model="selectedSize" :size="selectedColor.size" />
        </div>
        <div class="q-ml-sm">
          <div class="text-h7 text-bold q-mt-md title">Product Details</div>
          <div style="font-size: 18px">{{ product.detail }}</div>
        </div>
        <div class="row q-gutter-lg q-mt-sm">
          <q-btn
            label="Add to cart"
            color="primary"
            @click="addToCart"
            style="width: 150px"
          />
          <q-btn label="Buy" color="primary" style="width: 150px" />
        </div>
        <div class="col-1"></div>
      </div>
      <div class="col-2 q-mt-md">
        <div>
          <div class="text-bold text-center text-h5">
            {{ product.star_name }}'s Store
          </div>
          <div class="row justify-center q-mt-md">
            <q-avatar>
              <q-img :src="product.star_avatar" />
            </q-avatar>
          </div>
          <div class="row justify-center q-mt-md">
            <q-btn
              label="Homepage"
              color="primary"
              :to="`/star/${product.star_id}`"
            />
          </div>
        </div>
      </div>
    </div>
    <q-separator class="q-my-md q-mx-md" />

    <div class="text-h5 text-bold q-ml-md q-mb-md">Product Description</div>
    <div
      v-for="i in selectedColor.detail_images"
      :key="i"
      class="q-px-md"
      style="width: 100%"
    >
      <q-img :src="i" />
    </div>

    <q-separator class="q-my-md" />
    <div>
      <div class="q-ml-md text-h6 text-bold">Customers frequently viewed</div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { service } from "src/services/api";
import { useUserStore } from "src/stores/user";
import { tool } from "src/uril/tool";
import SizePicker from "src/components/Desktop/SizePicker.vue";
import _ from "lodash";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const selectedSize = ref("");
const productId = route.params.productId;
const selectedColor = ref({
  id: "",
  name: "",
  price: 0,
  unit: "",
  size: [],
  images: [],
  detail_imgaes: [],
});
const selectedImage = ref("");
const loadingAddCart = ref(false);
const userStore = useUserStore();
const product = ref({
  id: "",
  description: "",
  detail: "",
  colors: {},
  rating: 0,
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
    _.assign(selectedColor.value, data.color);
    selectedImage.value = selectedColor.value.images[0];
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
    const response = await service.addProductToCart({
      product_id: product.value.id,
      color_id: selectedColor.value.id,
      size: selectedSize.value.size_name,
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

<style scoped>
.product-img {
  width: 404px;
  height: 524px;
}

.carousel {
  box-shadow: none;
}

.product-img-children {
  width: 60px;
}

.product-img-children:hover {
  cursor: pointer;
}

.title {
  font-size: 25px;
}
</style>
