<template>
  <q-page>
    <div class="row">
      <div class="col-4 q-pa-md">
        <div><q-img :src="selectedImg" class="product-img" /></div>
        <div class="row q-mt-sm q-gutter-sm">
          <div class="col-1" v-for="i in imgs" :key="i.id">
            <q-img
              :src="i.src"
              class="product-img-children"
              @click="selectedImg = i.src"
            />
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="text-h5 q-mt-md">
          Avidlove Lingerie for Women Lace Corset and Panty Outfits Garter
          Lingerie Sets S-XXL
        </div>
        <div class="row">
          <q-rating v-model="rating" size="2em" disable color="orange" />
          <span class="q-mt-xs q-ml-sm">4.5</span>
          <span class="q-mt-xs q-ml-md text-blue">8993 ratings</span>
        </div>
        <q-separator class="q-my-md" />
        <div class="q-ml-sm">
          <span class="text-bold">Price:</span
          ><span class="q-ml-sm text-h6 text-bold text-red">$5.9</span>
        </div>
        <div>
          <div class="q-ml-sm q-mt-sm text-bold text-h7">Size:</div>
          <SizePicker v-model="selectedBtn" />
        </div>
        <div class="q-mt-md q-ml-sm">
          <div class="text-h7 text-bold">Color:</div>
          <div class="row q-gutter-md">
            <div class="col-1" v-for="i in colorImgs" :key="i.id">
              <q-img
                :src="i.src"
                class="product-img-children"
                @click="selectedImg = i.src"
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
import SizePicker from "src/components/SizePicker.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

defineOptions({
  name: "ProductDetail",
});

const route = useRoute();
const id = ref(route.params.id);
const slide = ref("pic1");
const selectedBtn = ref("");

const rating = ref(4.5);

const imgs = ref([
  {
    id: "1",
    src: "https://m.media-amazon.com/images/I/71Gi2kz4MQL._AC_SY879_.jpg",
  },
  {
    id: "2",
    src: "https://m.media-amazon.com/images/I/81mAnqVbRGL._AC_SY879_.jpg",
  },
  {
    id: "3",
    src: "https://m.media-amazon.com/images/I/81PYe0wanML._AC_SY879_.jpg",
  },
]);
const selectedImg = ref(imgs.value[0].src);

const colorImgs = ref([
  {
    id: "1",
    src: "https://m.media-amazon.com/images/I/81LQwSZs4hL._AC_SY879_.jpg",
  },
  {
    id: "2",
    src: "https://m.media-amazon.com/images/I/81-jQiMes9L._AC_SY879_.jpg",
  },
  {
    id: "3",
    src: "https://m.media-amazon.com/images/I/81kXJNjTocL._AC_SY879_.jpg",
  },
  {
    id: "4",
    src: "https://m.media-amazon.com/images/I/81Y8vVWsGhL._AC_SY879_.jpg",
  },
]);
</script>

<style scoped>
.product-img {
  width: 404px;
  height: 524px;
}

.carousel {
  box-shadow: none;
}

.product-img-children:hover {
  cursor: pointer;
}
</style>
