<template>
  <q-page padding style="padding-top: 0px">
    <div
      class="poster-container"
      :style="{ '--background-url': `url(${starDetail.poster_url})` }"
    >
      <q-img :src="starDetail.poster_url" fit="cover" height="35vh" />
      <q-img
        :src="starDetail.avatar_url"
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
            <!-- <q-btn
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
            /> -->
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
        <!-- <q-btn class="col-4" label="Follow" outline icon="add" /> -->
      </div>
    </div>
    <!--Product list-->
    <div class="q-mt-md">
      <div class="row">
        <div class="col">
          <div class="text-center text-h6 text-bold">Products</div>
          <div class="row q-pa-md">
            <div class="row q-mt-sm q-gutter-lg">
              <ProductItem
                class="q-mt-sm"
                v-for="p in starDetail.products?.products"
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
          <div class="text-h6 text-center text-bold">Photos</div>
          <div class="q-px-md">
            <q-img :src="starDetail.cover_url" fit="contain" height="150px" />
          </div>
        </div>
      </div>
      <div v-if="starDetail.products?.length > 20" class="row justify-center">
        <q-pagination v-model="currentPage" :max="9" direction-links />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import ProductItem from "src/components/Desktop/ProductItem.vue";
import { service } from "src/services/api";
import { useQuasar, Loading } from "quasar";
import { useRoute } from "vue-router";
import _ from "lodash";

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
  avatar_url: "",
  description: "",
  cover_url: "",
  poster_url: "",
  products: [],
});

const size = 20;
const currentPage = ref(1);
const $q = useQuasar();
const route = useRoute();
const starIdFinal = computed(() => {
  return props.starId !== null ? props.starId : route.params.id;
});
const loading = ref(false);

async function onLoad() {
  if (loading.value) {
    return;
  }

  Loading.show({
    message: "Loading",
  });

  try {
    const response = await service.getStarDetail(starIdFinal.value);
    const data = response.data.data;
    starDetail.value = data;
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "nagetive",
      message: error?.response?.data?.msg || "something went wrong",
      position: "top",
    });
  }

  loading.value = false;
  Loading.hide();
}

watch(starIdFinal, async () => {
  await onLoad();
});

onMounted(() => {
  onLoad();
});
</script>

<style scoped>
.gradient-linear {
  /* background-color: #9A3E56; */
  /* background-color: #f6f7fc; */
  background: linear-gradient(45deg, #424242, #000000);
}
.poster-container {
  position: relative;
}

.poster-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--background-url) center center / cover no-repeat;
  filter: blur(20px); /* 设置模糊程度 */
  z-index: 0;
}
</style>
