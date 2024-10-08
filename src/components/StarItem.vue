<template>
  <div>
    <div>
      <router-link :to="`/star/${props.id}`">
        <q-img class="star-product-img" :src="props.link" fit="contain" />
      </router-link>
    </div>
    <div class="q-ma-sm">
      <div class="row justify-center">
        <span class="text-bold text-h6">{{ props.name }}</span>
      </div>
      <div style="word-wrap: break-word">{{ props.desc }}</div>
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
  desc: {
    type: String,
    default: "",
  },
});
</script>

<style scoped></style>
