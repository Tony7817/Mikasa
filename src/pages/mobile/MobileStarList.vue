<template>
  <q-page>
    <q-infinite-scroll @load="onloadStars" :offset="200">
      <div v-for="s in stars" :key="s.id" @click="toStarHomePage(s.id)">
        <div style="position: relative">
          <q-img :src="s.image_url" />
          <span
            class="text-h5 text-bold"
            style="position: absolute; left: 5%; bottom: 2%"
            >{{ s.name }}</span
          >
        </div>
      </div>
      <template v-slot:loading>
        <div v-if="loading" class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { service } from "src/services/api";
import { ref } from "vue";
import { useRouter } from "vue-router";

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
const $q = useQuasar();
const PageSize = 2;
const loading = ref(false);
const isLastStarLoaded = ref(false);
const router = useRouter();

function toStarHomePage(id) {
  router.push(`/star/${id}`);
}

async function onloadStars(index, done) {
  if (isLastStarLoaded.value) {
    $q.notify({
      type: "positive",
      message: "No more stars",
      position: "center",
      timeout: 1,
    });
    return;
  }
  if (loading.value) {
    return;
  }
  loading.value = true;
  const body = {
    page: index,
    size: PageSize,
  };
  try {
    const response = await service.getStarList(body);
    const data = response.data.data;
    if (data.stars !== null) {
      stars.value.push(...response.data.data.stars);
    } else {
      done();
      isLastStarLoaded.value = true;
      loading.value = false;
      return;
    }
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: "error",
      position: "top",
    });
  }
  done();
  loading.value = false;
}
</script>

<style scoped></style>
