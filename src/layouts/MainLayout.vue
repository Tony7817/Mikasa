<template>
  <q-layout view="hHh Lpr fFf">
    <div class="row q-py-sm justify-center bg-primary">
      <!-- <div class="row q-py-sm justify-center gradient-linear"> -->
      <!-- <div class="row q-py-sm justify-center" style="background-color: #822678"> -->
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
      <div class="col-4 row q-pr-md">
        <q-space />
        <div>
          <q-btn icon="shopping_cart" flat color="white" :to="`/cart`" />
          <q-btn icon="person" flat color="white" @click="signIn()" />
          <q-menu v-if="userStore.isAuthenticated">
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section> Profile </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </div>
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
import { useUserStore } from "src/stores/user";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

defineOptions({
  name: "MainLayout",
});

const keyword = ref("");
const triggerSearch = ref(false);
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

function onSearch() {
  triggerSearch.value = !triggerSearch.value;
}

function signIn() {
  if (!userStore.isAuthenticated) {
    router.push({ name: "login", query: { next: route.path } });
  }
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
