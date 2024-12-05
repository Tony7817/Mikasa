<template>
  <div>
    <div>
      <router-link :to="`/star/${props.id}`">
        <q-img
          class="star-product-img"
          :class="{ 'mobile-img-height': $isMobile }"
          :src="props.link"
          fit="cover"
        />
      </router-link>
    </div>
    <div class="q-ma-sm">
      <div class="column q-ml-md">
        <div class="text-bold text-center" style="font-size: 16px">
          <span class="text-h5 text-bold" v-if="$isMobile">
            {{ props.name }}
          </span>
          <span v-else>
            {{ props.name }}
          </span>
        </div>
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

<style scoped>
.mobile-img-height {
  height: 60vh;
}
</style>
