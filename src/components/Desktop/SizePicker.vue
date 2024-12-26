<template>
  <div class="row q-gutter-sm q-ml-none">
    <q-btn
      v-for="s in props.size"
      :key="s.size_name"
      :label="s.size_name"
      :disable="s.in_stock === 0"
      flat
      outline
      dense
      :style="{
        backgroundColor: selectedBtn === s ? '#da4f7a' : 'white',
        color: selectedBtn === s ? 'white' : 'black',
        width: '36px',
      }"
      @click="selectedBtn = s"
    >
      <q-tooltip v-if="s.in_stock === 0" class="text-bold text-white bg-primary">
        OUT OF STOCK
      </q-tooltip>
    </q-btn>
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
