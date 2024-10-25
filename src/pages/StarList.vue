<template>
  <q-page padding style="background-color: #f7f7f7">
    <div class="row q-gutter-sm">
      <!--Left display area-->
      <div
        class="column q-gutter-sm col-2 q-pa-sm"
        style="background-color: white"
      >
        <StarBrand
          v-for="b in starbrands"
          :key="b.id"
          :avatar="b.avatar"
          :id="b.id"
          :link="b.link"
          :desc="b.desc"
        />
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
            :desc="s.description"
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
const stars = ref([]);
const currentPage = ref(1);
const $q = useQuasar();

watch(
  () => props.triggerSearch,
  async () => {
    await onload();
  }
);

async function onload() {
  try {
    const response = await service.getStarList({
      page: currentPage.value,
      size: 20,
      keyword: props.keyword,
    });
    stars.value = response.data.data.stars;
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: error.response.data.msg,
      position: "top",
    });
  }
}

onMounted(() => {
  onload();
});
</script>

<style scoped></style>
