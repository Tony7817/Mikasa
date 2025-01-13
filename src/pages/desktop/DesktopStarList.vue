<template>
  <q-page padding>
    <div class="" style="margin: auto">
      <!--Right star display area-->
      <div class="col" v-if="loading">
        <div class="row q-gutter-lg">
          <q-skeleton
            class="q-pa-sm col-2"
            v-for="i in 10"
            :key="i"
            width="256px"
            height="300px"
          />
        </div>
      </div>
      <div class="col" v-if="!loading">
        <div class="row q-gutter-lg">
          <StarItem
            class="q-pa-sm col-2"
            v-for="s in stars"
            :key="s.id"
            :id="s.id"
            :link="s.cover_url"
            :name="s.name"
            style="width: 256px"
          />
        </div>
        <div v-if="stars?.length > 20" class="row justify-center">
          <q-pagination v-model="currentPage" :max="9" direction-links />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import StarItem from "src/components/Desktop/StarItem.vue";
import { service } from "src/services/api";
import { onMounted, ref, watch } from "vue";

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
const loading = ref(false);

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
  if (loading.value) {
    return;
  }

  loading.value = true;

  const data = {
    page: currentPage.value,
    page_size: PageSize,
  };
  if (props.keyword !== "") {
    data.keyword = props.keyword;
  }
  try {
    const response = await service.getStarList(data);
    stars.value = response.data.data.stars;
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: "error",
      position: "top",
    });
  }

  loading.value = false;
}

onMounted(() => {
  onloadStars();
});
</script>

<style scoped></style>
