<template>
  <q-page>
    <div class="row">
      <div class="col-4 q-pa-md">
        <div>
          <q-img :src="selectedImage.url" class="product-img" fit="contain" />
        </div>
        <div class="row q-mt-sm q-gutter-x-sm">
          <div class="col-2" v-for="i in selectedColor.images" :key="i">
            <q-img
              :src="i.url"
              class="product-img-children"
              fit="contain"
              @click="selectedImage = i"
            />
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="text-h5 q-mt-md">
          {{ product.description }}
        </div>
        <div class="row">
          <q-rating v-model="rating" size="2em" disable color="orange" />
          <span v-if="product.rate" class="q-mt-xs q-ml-sm">{{
            product.rate
          }}</span>
          <span class="q-mt-xs q-ml-md text-blue"
            >{{ product.rate_count }} ratings</span
          >
          <span class="q-mt-xs q-ml-md text-blue"
            >{{ product.sold_num }} sold</span
          >
        </div>
        <q-separator class="q-my-md" />
        <div class="q-ml-sm">
          <span class="text-bold">Price:</span
          ><span class="q-ml-sm text-h6 text-bold text-red"
            >{{ product.price }}{{ tool.getUnit(product.unit) }}</span
          >
        </div>
        <div class="row q-mt-sm items-center">
          <div class="q-ml-sm text-bold text-h7">Size:</div>
          <SizePicker v-model="selectedBtn" :size="product.size" />
        </div>
        <div class="q-mt-sm q-ml-sm">
          <div class="text-h7 text-bold">Color:</div>
          <div class="row q-gutter-md">
            <div class="col-1" v-for="i in product.colors" :key="i">
              <q-img
                :src="i.images[0].url"
                class="product-img-children"
                @click="selectedColor = i"
                fit="contain"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="text-h7 text-bold q-mt-md">Product Details</div>
          <div>
            Style: 4 piece lingerie sets, teddy bodysuit, sexy lingerie, bra and
            panty set, bralette lingerie set, lingerie with garter, lace corset
            lingerie, corset and panty set, garter lingerie set.
          </div>
          <div>
            Design: Delicate eyelash lace adorns the underrwired corset with
            adjustable shoulder straps and garter belt，that high waistline
            shows off your amazing proportions, leg rings show your sexiness and
            charm even more.
          </div>
        </div>
      </div>
      <div class="col q-mt-lg">
        <div class="column flex-center items-center q-gutter-md">
          <q-btn
            label="Add to cart"
            outline
            color="primary"
            style="width: 150px"
          />
          <q-btn label="Buy" outline color="primary" style="width: 150px" />
        </div>
      </div>
    </div>
    <q-separator class="q-my-md" />
    <div>
      <div class="q-ml-md text-h6 text-bold">Customers frequently viewed</div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import SizePicker from "src/components/SizePicker.vue";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { service } from "src/services/api";
import { tool } from "src/uril/tool";

defineOptions({
  name: "ProductDetail",
});

const $q = useQuasar();
const route = useRoute();

const id = ref(route.params.id);
const slide = ref("pic1");
const selectedBtn = ref("");
const productId = route.params.productId;
const selectedColor = ref({});
const selectedImage = ref({});
const product = ref({
  id: "",
  price: 0,
  unit: "",
  colors_url: [],
  description: "",
  size: [],
  colors: [],
  rating: 0,
  default_color: {
    images_url: "",
  },
  rate_count: 0,
  sold_num: 0,
});

const rating = computed(() => {
  return product.value.rate ? product.value.rate : 0;
});

async function onLoadProduct() {
  try {
    const response = await service.getProductDetail(productId, {});
    product.value = response.data.data;
    for (let i = 0; i < product.value.colors.length; i++) {
      if (product.value.colors[i].id === product.value.default_color.id) {
        product.value.colors[i]._selected = true;
        selectedColor.value = product.value.colors[i];
        for (let j = 0; j < product.value.colors[i]?.images.length; i++) {
          if (j == 0) {
            product.value.colors[i].images[j]._selected = true;
            selectedImage.value = product.value.colors[i].images[j];
          } else {
            product.value.colors[i].images[j]._selected = false;
          }
        }
      } else {
        product.value.colors[i]._selected = false;
      }
    }
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: "Something went wrong",
      position: "top",
    });
  }
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
</style>
