<template>
  <q-page padding style="background-color: #f7f7f7">
    <div class="row q-gutter-sm">
      <!--Left display area-->
      <div
        class="column q-gutter-sm col-2 q-pa-sm"
        style="background-color: white"
      >
        <q-infinite-scroll @load="onloadBrands" :offset="250">
          <StarBrand
            class="q-mb-md"
            v-for="b in starbrands"
            :key="b.id"
            :avatar="b.star_avatar"
            :id="b.id"
            :link="b.star_home_url ? b.star_home_url : `/star/${b.star_id}`"
            :content="b.content"
          />
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
      <!--Right star display area-->
      <div class="col" style="background-color: white">
        <div class="row q-gutter-lg">
          <StarItem
            class="q-pa-sm col-2"
            v-for="s in stars"
            :key="s.id"
            :id="s.id"
            :link="s.image_url"
            :name="s.name"
            style="width: 256px"
          />
        </div>
        <div v-if="stars.length > 20" class="row justify-center">
          <q-pagination v-model="currentPage" :max="9" direction-links />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import StarBrand from "src/components/StarBrand.vue";
import StarItem from "src/components/StarItem.vue";
import { service } from "src/services/api";
import { onMounted, ref, watch } from "vue";

defineOptions({
  name: "StarList",
});

const props = defineProps({
  keyword: {
    type: String,
    required: false,
  },
  triggerSearch: {
    type: Boolean,
    required: false,
  },
});

const starbrands = ref([]);
const starBrandsPage = ref(1);
const stars = ref([]);
const currentPage = ref(1);
const $q = useQuasar();
const PageSize = 20;
const IsMoreBrands = ref(false);

watch(
  () => props.triggerSearch,
  async () => {
    await onloadStars();
  }
);

watch(
  () => props.keyword,
  async (newValue) => {
    if (newValue == "") {
      await onloadStars();
    }
  }
);

async function onloadStars() {
  try {
    const response = await service.getStarList({
      page: currentPage.value,
      size: PageSize,
      keyword: props.keyword,
    });
    stars.value = response.data.data.stars;
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: "error",
      position: "top",
    });
  }
}

async function onloadBrands(index, done) {
  if (!IsMoreBrands.value) {
    done(true);
  }

  try {
    const response = await service.getBrandList({
      page: starBrandsPage.value,
      size: PageSize,
    });
    if (response.data.data.brands.length < PageSize) {
      IsMoreBrands.value = false;
    }
    starbrands.value.push(...response.data.data.brands);
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "error",
      position: "top",
    });
  }
  starBrandsPage.value++;
  done();
}

onMounted(() => {
  onloadStars();
});
</script>

<style scoped></style>
