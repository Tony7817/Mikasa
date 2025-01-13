<template>
  <q-page padding>
    <div style="margin-left: 30px; margin-right: 30px">
      <div
        class="row items-center q-gutter-lg q-pl-md"
        style="cursor: pointer"
        @click="toStarHomePage"
      >
        <div>
          <q-avatar square>
            <q-img :src="product.star_avatar" />
          </q-avatar>
        </div>
        <div class="text-bold text-h6">
          <span class="text-center"> {{ product.star_name }}'s Store </span>
          <div>
            <q-rating
              class="star_rate"
              v-model="product.star_rate"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
              disable
              size="1em"
              color-selected="pink"
              color-half="pink"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4 q-pa-md">
          <div>
            <q-img :src="selectedImage" class="product-img" fit="cover" />
          </div>
          <div class="row q-mt-sm q-gutter-x-sm">
            <div v-for="i in displayImages" :key="i">
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
        <div class="col gradient-linear column">
          <div class="row">
            <div class="col-6 text-h5 q-mt-md" style="position: relative">
              {{ product.description }}
            </div>
            <q-space />
            <div class="col-2 column q-gutter-lg q-mt-sm">
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
          <!-- <div class="row">
          <q-chip color="primary" class="q-mt-sm" label="vedio link" icon="live_tv" square />
        </div> -->
          <div class="row qutter-x-md q-mt-xs items-center">
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
          </div>
          <q-separator class="q-mb-md q-mt-sm" />
          <div class="q-ml-sm">
            <div class="row q-gutter-md">
              <div v-for="color in product.colors" :key="color.color_id">
                <div
                  class="q-mb-md"
                  style="width: 80px; height: 80px; border-radius: 50%"
                  :style="{ backgroundColor: color.color_name }"
                  @click="selectedColor = color"
                >
                  <q-img :src="color.cover_url" />
                </div>
              </div>
            </div>
            <div class="row items-center q-mt-lg">
              <span class="text-bold title">Price</span
              ><span
                class="q-ml-sm text-h6 text-bold text-primary"
                style="font-size: 25px"
                >{{ selectedColor.price
                }}{{ tool.getUnit(selectedColor.unit) }}</span
              >
            </div>
          </div>
          <div class="row q-mt-md items-center">
            <div class="q-ml-sm text-bold text-h7 title">Size</div>
            <SizePicker v-model="selectedSize" :size="selectedColor.size" />
          </div>
          <div class="q-ml-sm">
            <div class="text-h7 text-bold q-mt-md title">Product Details</div>
            <div style="font-size: 18px">{{ product.detail }}</div>
          </div>
          <div class="col-1"></div>
        </div>
      </div>
      <q-separator class="q-my-md q-mx-md" />

      <div class="row">
        <div class="col-8">
          <div class="text-h5 text-bold q-ml-md q-mb-md">
            Product Description
          </div>
          <div
            v-for="i in selectedColor.detail_images"
            :key="i"
            class="q-px-md"
            style="width: 90%"
          >
            <q-img :src="i" />
          </div>
        </div>
      </div>
      <q-separator class="q-my-md" />
      <div class="q-ml-md">
        <div class="text-h6 text-bold q-mb-md">Top Reviews</div>
        <div v-for="c in product.comments.comments" :key="c.id">
          <div class="row items-center">
            <div class="col-1" style="width: 5%">
              <q-avatar color="primary">{{ c.user_name[0] }}</q-avatar>
            </div>
            <div class="col row q-gutter-md items-center">
              <span class="text-h6 text-bold">{{ c.user_name }}</span>
              <span>size: {{ c.size }}</span>
              <span>color: {{ c.color }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-1" style="width: 5%"></div>
            <div class="col">{{ parseCommentTime(c.created_at) }}</div>
          </div>
          <div class="col-1" style="width: 5%"></div>
          <div class="row q-mt-sm">
            <div class="col-1" style="width: 5%"></div>
            <div class="col">{{ c.comment }}</div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-1" style="width: 5%"></div>
            <div class="col row q-gutter-xs">
              <div ref="imageViewer" class="row q-gutter-sm">
                <img
                  v-for="(s, index) in c.images_thumb"
                  :key="s"
                  @click="getOnclick"
                  :data-original="`${c.images[index]}`"
                  :src="s"
                  style="height: 100px"
                />
              </div>
              <!-- <div
                class="col-1 row"
                v-for="(i, index) in c.images_thumb"
                :key="index"
                @click="showImageDialog(index, c.images)"
              >
                <q-img :src="i" height="100px" />
              </div> -->
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col-1" style="width: 5%"></div>
            <div class="col">
              <div v-if="c.like_num > 0">
                {{ c.like_num }} people found this helpful
              </div>
              <q-btn
                class="q-mt-sm"
                label="Helpful"
                unelevated
                outline
                no-caps
                color="primary"
                padding
                rounded
              />
            </div>
          </div>
        </div>
      </div>
      <q-separator class="q-my-md" />
      <div>
        <div class="q-ml-md text-h6 text-bold">Customers frequently viewed</div>
      </div>
    </div>
    <!-- Lightbox 组件 -->

    <!-- <vue-easy-lightbox
      v-if="isLightboxOpen"
      :visible="isLightboxOpen"
      :imgs="imageDialogUrls"
      :index="imageDialogIndex"
      @hide="isLightboxOpen = false"
    /> -->
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { service } from "src/services/api";
import { tool } from "src/uril/tool";
import SizePicker from "src/components/Desktop/SizePicker.vue";
import _ from "lodash";
import { DateTime } from "luxon";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

// viewer
const isLightboxOpen = ref(false);
const imageDialogUrls = ref([]);
const imageDialogIndex = ref(0);
const displayImages = computed(() => {
  var res = [selectedColor.value.cover_url];
  for (let i = 0; i < selectedColor.value.images.length; i++) {
    res.push(selectedColor.value.images[i]);
  }
  return res;
});

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
const product = ref({
  id: "",
  description: "",
  star_rate: 5,
  star_name: "",
  detail: "",
  colors: {},
  rating: 0,
  rate_count: 0,
  sold_num: 0,
  comments: {
    comments: [],
    total: 0,
  },
});

const imageViewer = ref(null);
const getOnclick = () => {
  const viewer = new Viewer(imageViewer.value[0], {
    url: "data-original",
    toolbar: false,
    show: function () {
      viewer.update();
    },
  });
};

const rating = computed(() => {
  return product.value.rate ? product.value.rate : 0;
});

function parseCommentTime(timestamp) {
  const localTime = DateTime.fromSeconds(timestamp).setLocale("en-US");
  return localTime.toLocaleString(DateTime.DATETIME_MED);
}

function showImageDialog(i, images) {
  imageDialogIndex.value = i;
  imageDialogUrls.value = images;
  isLightboxOpen.value = true;
}

function showViewer(images, imagesThumb) {
  const imageDialogUrls = ref([]);
  images.forEach((p) => {
    imageDialogUrls.value.push({
      src: p,
      srcSet: images,
    });
  });

  imagesThumb.forEach((p, index) => {
    imageDialogUrls.value[index].thumbnail = p;
  });

  return imageDialogUrls;
}

async function onLoadProduct() {
  try {
    const response = await service.getProductDetail(productId, {});
    const data = response.data.data;
    _.assign(product.value, data);
    _.assign(selectedColor.value, data.default_color);
    selectedImage.value = selectedColor.value.cover_url;
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: "Something went wrong",
      position: "top",
    });
  }
}

function toStarHomePage() {
  router.push(`/star/${product.value.star_id}`);
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

.star_rate.disabled {
  cursor: pointer;
}

.viewer-container img {
  width: 100%;
  height: auto;
}
</style>
