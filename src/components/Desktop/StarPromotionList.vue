<template>
  <div class="">
    <q-list dense id="list">
      <div class="text-center" style="font-size: 16px">Endorser</div>
      <q-separator class="q-my-sm" />
      <template v-if="loading">
        <q-item v-for="i in 5" :key="i">
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" width="65%" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <q-item
        :class="{ active: b._selected === true }"
        v-for="b in brands"
        :key="b.id"
        clickable
        dense
        @click="selectStar(b.star_id)"
      >
        <q-item-section>
          <StarBrand
            :key="b.id"
            :avatar="b.star_avatar"
            :id="b.id"
            :content="b.star_name"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { service } from "src/services/api";
import { onMounted, ref } from "vue";
import StarBrand from "src/components/Desktop/StarPromotionItem.vue";
import { useQuasar } from "quasar";

const emit = defineEmits(["update-star-id"]);

const $q = useQuasar();
const brands = ref([]);
const loading = ref(false);

function selectStar(starId) {
  brands.value.forEach((b) => {
    if (b.star_id === starId) {
      b._selected = true;
    } else {
      b._selected = false;
    }
  });
  emit("update-star-id", starId);
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
      brands.value.push(...data.recommends);
      brands.value.forEach((b) => {
        b._selected = false;
      });
      brands.value[0]._selected = true;
    }
    emit("update-star-id", brands.value[0].star_id);
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

<style lang="scss" scoped>
.q-item.active {
  background: $pink-5;
}
</style>
