<template>
  <div class="row items-center q-py-xs">
    <div class="col-2">
      <q-avatar size="55px">
        <q-img :src="props.avatar" />
      </q-avatar>
    </div>
    <div class="col q-ml-sm text-center">
      <div
        class="text-white text-body1 text-bold"
        style="text-decoration: none"
      >
        {{ props.content }}
      </div>
    </div>
    <div class="col-1 text-center">
      <q-icon name="trending_up" />
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: "StarBrand" });

const props = defineProps({
  id: {
    type: String,
    default: "",
    required: true,
  },
  avatar: {
    type: String,
    default: "",
    required: true,
  },
  content: {
    type: String,
    default: "",
    required: true,
  },
});
</script>

<style scoped></style>
