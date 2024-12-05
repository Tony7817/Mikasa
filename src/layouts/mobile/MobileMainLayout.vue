<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white q-py-xs">
      <q-toolbar>
        <q-toolbar-title class="col-3"> P </q-toolbar-title>
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

    <q-footer class="bg-primary text-white">
      <q-tabs v-model="tabs">
        <q-route-tab name="Star" icon="diversity_1" label="Star" to="/stars" />
        <q-route-tab
          name="Product"
          icon="local_mall"
          label="Product"
          to="/product"
        />
        <q-route-tab name="My" icon="account_circle" label="My" to="/user" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const leftDrawerOpen = ref(false);
const tabs = ref("Star");
const router = useRouter();

onMounted(() => {
  router.push("/stars");
});
</script>
