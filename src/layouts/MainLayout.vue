<template>
  <q-layout view="hHh Lpr fFf">
    <div class="row q-py-md justify-center gradient-linear">
      <div class="col-4"></div>
      <q-input
        class="col"
        v-model="keyword"
        placeholder="Search..."
        dense
        filled
        bg-color="white"
        clearable
        @keyup.enter="onSearch"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-btn round dense flat label="Go" />
        </template>
      </q-input>
      <div class="col-4"></div>
    </div>

    <q-page-container>
      <router-view :keyword="keyword" :triggerSearch="triggerSearch" />
    </q-page-container>

    <!--Footer-->
    <div class="row justify-center q-pa-md text-white gradient-linear">
      <div class="col column items-center q-gutter-sm">
        <div>Contact Us</div>
        <div>MissLover@gmail.com</div>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

defineOptions({
  name: "MainLayout",
});

const keyword = ref("");
const triggerSearch = ref(false);

function onSearch() {
  triggerSearch.value = !triggerSearch.value;
}
</script>

<style scoped>
.searchInput {
  width: 500px;
}

.gradient-linear {
  /* background-color: #9A3E56; */
  /* background-color: #f6f7fc; */
  background: linear-gradient(45deg, #cb2a45, #2a4a82);
}
</style>
