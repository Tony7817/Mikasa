<template>
  <div class="row" style="padding: 23px 16px 16px 16px">
    <div class="col-1"></div>
    <div class="col column">
      <div class="row">

      </div>
    </div>
    <div class="col-4"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';


const onloading = ref(false)

async function onLoad() {
  if (onloading.value) {
    return
  }

  onloading.value = true

  try {
    
  } catch (error) {

  }

  onloading.value = false
}
</script>

<style scoped></style>
