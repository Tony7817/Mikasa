<template>
  <q-page padding>
    <div class="q-ml-lg text-h5 text-bold q-mt-md">Hot Endorser</div>
    <div
      class="row items-center q-gutter-lg q-mt-md"
      style="width: 80vh; margin: auto"
    >
      <div
        v-for="s in stars1"
        :key="s.star_id"
        @click="toStarHomePage(s.star_id)"
      >
        <q-avatar class="col-2">
          <q-img :src="s.star_avatar" width="50px" />
        </q-avatar>
        <div class="text-center q-mt-sm">{{ s.star_name.split(" ")[0] }}</div>
      </div>
    </div>
    <div
      class="row items-center q-gutter-lg q-mt-md"
      style="width: 80vh; margin: auto"
    >
      <div v-for="s in stars2" :key="s.star_id">
        <q-avatar>
          <q-img :src="s.star_avatar" width="50px" />
        </q-avatar>
        <div class="text-center q-mt-sm">{{ s.star_name.split(" ")[0] }}</div>
      </div>
    </div>

    <q-separator class="q-mx-lg q-my-md" />

    <div class="q-ml-lg text-h5 text-bold q-mb-md">Products</div>
    <div class="q-my-md">
      <q-infinite-scroll
        @load="onLoadProduct"
        :disable="isLastStarLoaded"
        :offset="250"
      >
        <div class="row items-start q-px-md q-gutter-lg">
          <div class="col-5" v-for="p in products" :key="p.id">
            <div class="row items-center q-gutter-md q-mb-sm">
              <q-avatar>
                <q-img :src="p.star_avatar" width="50px" />
              </q-avatar>
              <q-badge
                class="text-body2 text-bold"
                :label="p.star_name.split(' ')[0]"
              />
            </div>
            <router-link :to="`/product/${p.id}`">
              <q-img
                class="star-product-img"
                :src="p.default_color.cover_url"
                fit="cover"
                height="150px"
              />
            </router-link>
            <div class="q-mt-sm">
              <div class="text-none-style">{{ p.description }}</div>
              <div class="text-primary text-bold" style="font-size: 20px">
                {{ getPrice(p.default_color.price, p.default_color.unit) }}
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <q-spinner
            v-if="loadingProduct"
            class="q-mt-md"
            size="50px"
            color="primary"
          />
          <div v-else-if="isLastStarLoaded" class="text-h6 q-mt-md">- . -</div>
        </div>
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { service } from "src/services/api";
import { onMounted } from "vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { tool } from "src/uril/tool";

const router = useRouter();
const loading = ref(false);
const $q = useQuasar();
const stars1 = ref([]);
const stars2 = ref([]);
const loadingProduct = ref(false);
const products = ref([]);
const isLastStarLoaded = ref(false);

const getPrice = (p, u) => {
  return tool.formatPrice(p) + tool.getUnit(u);
};

function toStarHomePage(id) {
  router.push(`/star/${id}`);
}

async function onLoadProduct(index, done) {
  if (loadingProduct.value) {
    return;
  }
  loadingProduct.value = true;

  try {
    const response = await service.getProductList({
      page: index,
      page_size: 10,
    });
    const data = response.data.data;
    if (data.products?.length > 0) {
      data.products.forEach((p) => {
        products.value.push(p);
      });
      if (data.products.length < 10) {
        isLastStarLoaded.value = true;
      }
    } else {
      $q.notify({
        type: "positive",
        message: "No more products",
        position: "top",
      });
      isLastStarLoaded.value = true;
      done();
    }
  } catch (error) {
    isLastStarLoaded.value = true;
    done();
    console.log(error);
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "something went wrong",
      position: "top",
    });
  } finally {
    done();
  }

  loadingProduct.value = false;
}

async function onloadBrands() {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const response = await service.getBrandList({});
    const data = response.data.data;
    if (data.recommends.length > 0) {
      data.recommends.forEach((b, index) => {
        if (index < 5) {
          stars1.value.push(b);
        } else {
          stars2.value.push(b);
        }
      });
    }
  } catch (error) {
    console.log(error);

    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "something went wrong",
      position: "top",
    });
  }
  loading.value = false;
}

onMounted(() => {
  onloadBrands();
});
</script>

<style lang="scss" scoped></style>
