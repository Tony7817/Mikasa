<template>
  <div class="row q-gutter-xs q-ml-none">
    <q-btn
      v-for="s in props.size"
      :key="s"
      :label="s"
      flat
      outline
      dense
      :style="{
        backgroundColor: selectedBtn === s ? '#CB2A45' : 'white',
        color: selectedBtn === s ? 'white' : 'black',
        width: '36px',
      }"
      @click="selectedBtn = s"
    />
  </div>
</template>

<script setup>
defineOptions({
  name: "ProductDetail",
});

const props = defineProps({
  size: {
    type: Array,
    required: true,
  },
});

const selectedBtn = defineModel();
</script>
