<template>
  <q-page style="padding: 10px 10px 0px 10px">
    <div class="row q-gutter-sm">
      <!--Left display area-->
      <StarPromotionList class="col-2" />
      <!--Right star display area-->
      <div class="col">
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
import StarItem from "src/components/StarItem.vue";
import StarPromotionList from "src/components/StarPromotionList.vue";
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

const stars = ref([]);
const currentPage = ref(1);
const $q = useQuasar();
const PageSize = 20;

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

onMounted(() => {
  onloadStars();
});
</script>

<style scoped></style>
