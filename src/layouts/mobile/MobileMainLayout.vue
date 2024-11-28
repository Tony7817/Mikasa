<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title> Porn Store </q-toolbar-title>
        <q-input outlined rounded dense />
        <q-space />
        <q-btn icon="shopping_cart" flat />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <!-- <q-page-container>
      <router-view />
    </q-page-container> -->

    <q-footer elevated class="bg-grey-8 text-white">
      <q-tabs>
        <q-tab name="Home" icon="home" label="Home"></q-tab>
        <q-tab name="Star" icon="diversity_1" label="Star"></q-tab>
        <q-tab name="Product" icon="local_mall" label="Product"></q-tab>
        <q-tab name="My" icon="account_circle" label="My"></q-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>
