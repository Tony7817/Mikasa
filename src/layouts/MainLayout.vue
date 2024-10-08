<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated class="gradient-linear">
      <q-toolbar class="row justify-center">
        <q-toolbar-title class="col-1"> Miss Lover </q-toolbar-title>
        <q-space />
        <q-input
          class="col-4 q-ml-md q-mr-md bg-white"
          v-model="keyword"
          filled
          placeholder="Search..."
          dense
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-btn round dense flat label="Go" />
          </template>
        </q-input>
        <q-space />
        <q-btn dense flat icon="person" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
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
</script>

<style scoped>
.searchInput {
  width: 500px;
}

.gradient-linear {
  background: linear-gradient(45deg, #cb2a45, #2a4a82);
}
</style>
