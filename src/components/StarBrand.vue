<template>
  <div class="row">
    <q-avatar size="50px">
      <q-img :src="props.avatar" />
    </q-avatar>
    <div class="col q-ml-sm">
      <router-link class="text-primary" :to="props.link">
        <!-- Lucy wears a sexy black stocking on Pornhub, come and watch it -->
        {{ props.content }}
      </router-link>
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
