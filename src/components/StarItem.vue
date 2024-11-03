<template>
  <div>
    <div>
      <router-link :to="`/star/${props.id}`">
        <q-img class="star-product-img" :src="props.link" fit="contain" />
      </router-link>
    </div>
    <div class="q-ma-sm">
      <div class="column q-ml-md">
        <div class="" style="font-size: 16px">{{ props.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "StarItem",
});

const props = defineProps({
  id: {
    type: String,
    default: "",
    required: true,
  },
  link: {
    type: String,
    default: "",
    required: true,
  },
  name: {
    type: String,
    default: "",
    required: true,
  },
});
</script>

<style scoped></style>
