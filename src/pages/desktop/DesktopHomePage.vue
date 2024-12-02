<template>
  <q-page>
    <div class="row q-gutter-sm">
      <StarPromotionList
        @update-star-id="(val) => (selectedStarId = val)"
        class="col-2"
      />
      <div class="col">
        <q-page-container>
          <StarDetail
            v-if="selectedStarId !== null"
            :star-id="selectedStarId"
          />
        </q-page-container>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import StarPromotionList from "src/components/Desktop/StarPromotionList.vue";
import { ref } from "vue";
import StarDetail from "src/pages/StarDetail.vue";

const selectedStarId = ref(null);
</script>

<style scoped></style>
