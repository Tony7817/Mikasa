<template>
  <q-layout class="q-pb-lg" view="hHh Lpr fFf">
    <!-- <div class="row q-py-sm justify-center bg-primary"> -->
    <!-- <div class="row q-py-sm justify-center gradient-linear"> -->
    <div class="row q-py-lg justify-center q-pb-sm">
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
          Lureros
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
          :class="{ active: selectedTab === ProductTab }"
          @click="toProduct"
          >Product</span
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
              <q-list style="min-width: 200px" separator>
                <q-item
                  clickable
                  v-close-popup
                  :to="{ name: 'UserManageAccount' }"
                >
                  <q-item-section>
                    <div class="row justify-center items-center q-gutter-md">
                      <q-avatar color="primary" textColor="white" size="40px">{{
                        userStore.user.name[0]
                      }}</q-avatar>
                      <div class="text-center">
                        {{ userStore.user.name }}
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section>
                    <div class="text-center">Log Out</div>
                  </q-item-section>
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

  <div class="q-pa-md bg-dark" style="border-top: 1px solid #283237;">
    <div class="text-h6 q-mb-sm q-px-lg">Company</div>
    <div class="row q-gutter-md q-px-lg">
      <a href="/policy" class="text-white">Terms Of Service</a>
      <a href="/policy" class="text-white">Private Policy</a>
      <a href="/policy" class="text-white">Refund Policy</a>
      <a href="/policy" class="text-white">Shopping Policy</a>
    </div>
  </div>
</template>

<script setup>
import {
  ContactTab,
  HomeTab,
  ProductTab,
  StarsTab,
} from "src/composables/consts";
import { setup } from "src/composables/MainLayout";
import { watch } from "vue";

const {
  keyword,
  triggerSearch,
  userStore,
  route,
  router,
  productAmountInCart,
  loading,
  selectedTab,
  onSearch,
  toContact,
  toStars,
  toHome,
  toProduct,
  onload,
  signIn,
} = setup();

function logout() {
  userStore.clearUser();
  router.go(0);
}

watch(
  () => route.meta.tab,
  (newTab) => {
    selectedTab.value = newTab;
  }
);
</script>

<style lang="scss" scoped>
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
  color: $pink-5;
  font-weight: bold;
}

.menu-font:hover {
  text-decoration: underline;
}
</style>
