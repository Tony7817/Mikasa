<template>
  <div style="background-color: white">
    <q-img
      :src="props.posterLink"
      fit="cover"
      style="cursor: pointer"
      @click="toMystore"
    />
    <div class="row justify-center">
      <q-btn class="q-mt-lg" label="Go To My Store" @click="toMystore" />
    </div>
    <q-separator style="margin-top: 25px" inset />
    <div
      class="text-center text-h5 q-mt-md"
      style="
        font-family: Playfair Display;
        font-style: italic;
        margin-bottom: 30px;
      "
    >
      Arianna Castillo​
    </div>
    <div class="row items-center" v-if="props.brandBlock">
      <q-img
        class="col-5"
        :src="props.brandBlock[0].img_url"
        style="cursor: pointer"
      />
      <div class="col q-pa-md" style="font-family: Montserrat; font-size: 16px">
        <div>
          {{ props.brandBlock[0].content }}
        </div>
      </div>
    </div>
    <div class="row items-center q-mt-lg" v-if="props.brandBlock">
      <div class="col" style="font-family: Montserrat; font-size: 16px">
        <div>
          {{ props.brandBlock[1].content }}
        </div>
      </div>
      <q-img
        class="col-5 q-mr-md"
        :src="props.brandBlock[1].img_url"
        style="cursor: pointer"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  posterLink: {
    type: String,
    required: true,
  },
  starId: {
    type: String,
    required: true,
  },
  brandBlock: {
    type: Array,
    required: false,
    default: null,
  },
});

const router = useRouter();

function toMystore() {
  router.push(`/star/${props.starId}`);
}
</script>

<style scoped></style>
