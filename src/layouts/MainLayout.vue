<template>
  <q-layout class="q-pb-lg" view="hHh Lpr fFf">
    <!-- <div class="row q-py-sm justify-center bg-primary"> -->
    <!-- <div class="row q-py-sm justify-center gradient-linear"> -->
    <div class="row q-py-sm justify-center q-pb-sm">
      <div class="col-4 row items-center q-pl-md q-gutter-md">
        <span
          class="text-h6 q-mb-xs"
          style="
            font-family: Playfair Display;
            font-style: italic;
            cursor: pointer;
          "
          @click="toHome"
        >
          Miss Lover
        </span>
        <span
          class="menu-font"
          :class="{ active: selectedTab === HomeTab }"
          @click="toHome"
          >Home</span
        >
        <span
          class="menu-font"
          :class="{ active: selectedTab === StarsTab }"
          @click="toStars"
          >Stars</span
        >
        <span
          class="menu-font"
          :class="{ active: selectedTab === ContactTab }"
          @click="toContact"
          >Contact</span
        >
      </div>
      <q-input
        class="col"
        v-model="keyword"
        placeholder="Search..."
        dense
        rounded
        outlined
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
          <q-btn icon="shopping_cart" flat :to="`/cart`" />
          <q-btn icon="person" flat @click="signIn()">
            <q-menu v-if="userStore.isAuthenticated">
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup :to="`/user`">
                  <q-item-section> Profile </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="userStore.clearUser()">
                  <q-item-section> Log Out </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </div>

    <q-page-container>
      <router-view :keyword="keyword" :triggerSearch="triggerSearch" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ContactTab, HomeTab, StarsTab } from "src/composables/consts";
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
const productAmountInCart = ref(0);
const loading = ref(false);
const selectedTab = ref(HomeTab);

function onSearch() {
  triggerSearch.value = !triggerSearch.value;
}

function toContact() {
  selectedTab.value = ContactTab;
}

function toStars() {
  selectedTab.value = StarsTab;
  router.push({ name: "stars" });
}

function toHome() {
  selectedTab.value = HomeTab;
  router.push({ name: "home" });
}

async function onload() {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
  } catch (error) {}

  loading.value = false;
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

.menu-font {
  font-family: Montserrat;
  font-size: 16px;
  cursor: pointer;
}

.menu-font.active {
  color: #8069f6;
}

.menu-font:hover {
  text-decoration: underline;
}
</style>
