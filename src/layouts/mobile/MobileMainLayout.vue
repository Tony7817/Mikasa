<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white q-py-xs">
      <q-toolbar>
        <q-toolbar-title class="col-3"> Lureros </q-toolbar-title>
        <q-input class="col-6" color="white" outlined rounded dense />
        <div class="col-3 row">
          <q-space />
          <q-btn icon="shopping_cart" flat />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { route } from "quasar/wrappers";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const leftDrawerOpen = ref(false);
const tabs = ref("Star");
</script>
