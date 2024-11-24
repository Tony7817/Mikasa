<template>
  <q-page>
    <div class="row q-gutter-sm">
      <StarPromotionList @update-brand-detail="setBrandDetail" class="col-2" />
      <StarPromotionDetail
        class="col"
        :star-id="brandDetail.star_id"
        :poster-link="brandDetail.poster_url"
        :brand-block="brandDetail.block"
      />
    </div>
  </q-page>
</template>

<script setup>
import StarPromotionDetail from "src/components/StarPromotionDetail.vue";
import StarPromotionList from "src/components/StarPromotionList.vue";
import { ref } from "vue";

const brandDetail = ref({});

function setBrandDetail(val) {
  brandDetail.value = val;
}
</script>

<style scoped></style>
