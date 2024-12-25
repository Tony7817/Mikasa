<template>
  <div class="row q-gutter-sm q-ml-none">
    <q-btn
      v-for="s in props.size"
      :key="s.size_name"
      :label="s.size_name"
      flat
      outline
      dense
      :style="{
        backgroundColor: selectedBtn === s ? '#da4f7a' : 'white',
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

<style lang="scss" scoped></style>
