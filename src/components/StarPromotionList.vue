<template>
  <div class="">
    <q-list dense id="list">
      <div class="text-center" style="font-size: 16px">Hot Stars</div>
      <q-separator class="q-my-sm" />
      <q-item v-for="s in stars" :key="s.id" clickable dense>
        <q-item-section>
          <StarBrand
            :key="s.id"
            :avatar="s.star_avatar"
            :id="s.id"
            :link="s.star_home_url ? s.star_home_url : `/star/${s.star_id}`"
            :content="s.star_name"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { service } from "src/services/api";
import { onMounted, ref } from "vue";
import StarBrand from "src/components/StarPromotionItem.vue";
import { useQuasar } from "quasar";

defineOptions({
  name: "StarPromotionList",
});
const emit = defineEmits(["update-star-id"]);

const $q = useQuasar();
const stars = ref([]);
const loading = ref(false);

async function onloadBrands() {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const response = await service.getBrandList({});
    const data = response.data.data;
    stars.value.push(...data.brands);
    emit("update-star-id", data.default_star_id);
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "something went wrong",
      position: "top",
    });
  }
  loading.value = false;
}

onMounted(() => {
  onloadBrands();
});
</script>

<style scoped></style>
