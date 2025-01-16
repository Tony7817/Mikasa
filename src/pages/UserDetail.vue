<template>
  <q-page class="q-px-md">
    <div class="row q-gutter-sm">
      <div class="column q-getter-sm col-2 q-pa-sm bg-grey-10">
        <q-list style="max-width: 350px">
          <q-item
            clickable
            :class="{ 'bg-primary': selectedItem === Account }"
            @click="selectItem(Account, 'UserManageAccount')"
          >
            <q-item-section>
              <div class="row q-gutter-md items-center">
                <q-icon
                  :color="selectedItem === Account ? 'white' : 'primary'"
                  name="person"
                  style="font-size: 20px"
                />
                <div style="font-size: 16px">{{ Account }}</div>
              </div>
            </q-item-section>
          </q-item>
          <q-item clickable :class="{ 'bg-primary': selectedItem === Orders }" @click="selectItem(Orders, 'UserOrder')">
            <div class="row q-gutter-md items-center">
              <q-icon
                :color="selectedItem === Orders ? 'white' : 'primary'"
                name="shopping_bag"
                style="font-size: 20px"
              />
              <div style="font-size: 16px">{{ Orders }}</div>
            </div>
          </q-item>
          <q-item
            clickable
            v-if="userStore.user.role > 0"
            @click="selectItem(StarStore, 'UserManageStar')"
            :class="{ 'bg-primary': selectedItem === StarStore }"
          >
            <div class="row q-gutter-md items-center">
              <q-icon
                :color="selectedItem === StarStore ? 'white' : 'primary'"
                name="shopping_bag"
                style="font-size: 20px"
              />
              <div style="font-size: 16px">{{ StarStore }}</div>
            </div>
          </q-item>
          <q-item
            clickable
            :class="{ 'bg-primary': selectedItem === Feedback }"
          >
            <div class="row q-gutter-md items-center">
              <q-icon
                :color="selectedItem === Feedback ? 'white' : 'primary'"
                name="chat"
                style="font-size: 20px"
              />
              <div style="font-size: 16px">{{ Feedback }}</div>
            </div>
          </q-item>
        </q-list>
      </div>
      <div class="col bg-grey-10">
        <q-page-container>
          <router-view></router-view>
        </q-page-container>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "src/stores/user";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const selectedItem = ref("Account");
const Account = ref("Account");
const Orders = ref("Orders");
const StarStore = ref("Star Management");
const Feedback = ref("Feedback");

function selectItem(item, routerName) {
  selectedItem.value = item;
  router.push({ name: routerName });
}

onMounted(() => {});
</script>

<style scoped></style>
