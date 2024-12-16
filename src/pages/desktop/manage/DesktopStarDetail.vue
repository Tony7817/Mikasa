<template>
  <q-page>
    <div></div>
  </q-page>
</template>

<script setup>
import { service } from "src/services/api";
import { ref } from "vue";

const props = defineProps({
  starId: {
    type: String,
    required: true,
  },
});

const loading = ref(false);
const star = ref();
async function onLoad() {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const response = await service.getProductDeta(props.starId);
    const data = response.data.data;
    star.value = data;
  } catch (error) {}

  loading.value = false;
}
</script>
