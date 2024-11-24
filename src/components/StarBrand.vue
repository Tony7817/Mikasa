<template>
  <div class="row items-center">
    <div class="col-2">
      <q-avatar size="50px">
        <q-img :src="props.avatar" />
      </q-avatar>
    </div>
    <div class="col q-ml-sm text-center">
      <router-link
        class="text-black"
        style="font-size: 14px; text-decoration: none"
        :to="props.link"
      >
        {{ props.content }}
      </router-link>
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
  link: {
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
