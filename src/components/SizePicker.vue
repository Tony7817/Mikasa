<template>
  <div class="row q-gutter-xs q-ml-none">
    <q-btn
      v-for="s in scales"
      :key="s.label"
      :label="s.label"
      flat
      outline
      dense
      :style="{
        backgroundColor: selectedBtn === s.value ? '#CB2A45' : 'white',
        color: selectedBtn === s.value ? 'white' : 'black',
        width: '36px',
      }"
      @click="selectedBtn = s.value"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

defineOptions({
  name: "ProductDetail",
});

const selectedBtn = defineModel();
const scales = ref([
  { label: "XXS", value: "xxs" },
  { label: "XS ", value: "xs" },
  { label: " S ", value: "s" },
  { label: " M ", value: "m" },
  { label: " L ", value: "l" },
  { label: "XL ", value: "xl" },
  { label: "XXL ", value: "xxl" },
  { label: "3XL", value: "3xl" },
]);
</script>
