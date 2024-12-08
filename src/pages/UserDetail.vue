<template>
  <q-page class="q-px-md">
    <div class="row q-gutter-sm">
      <div
        class="column q-getter-sm col-2 q-pa-sm bg-grey-10"
        style="height: 100vh"
      >
        <q-list style="max-width: 350px">
          <q-item clickable>
            <q-item-section>
              <div class="row q-gutter-md items-center">
                <q-icon color="primary" name="person" style="font-size: 20px" />
                <div style="font-size: 16px">Account</div>
              </div>
            </q-item-section>
          </q-item>
          <q-item clickable>
            <div class="row q-gutter-md items-center">
              <q-icon
                color="primary"
                name="shopping_bag"
                style="font-size: 20px"
              />
              <div style="font-size: 16px">Orders</div>
            </div>
          </q-item>
          <q-item clickable>
            <div class="row q-gutter-md items-center">
              <q-icon color="primary" name="chat" style="font-size: 20px" />
              <div style="font-size: 16px">Feedback</div>
            </div>
          </q-item>
        </q-list>
      </div>
      <div class="col bg-grey-10">
        <component
          :is="currentComponent"
          :data="selectedData"
          v-if="currentComponent"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, shallowRef } from "vue";
import UserBasic from "src/components/Desktop/UserBasic.vue";

const selectedData = ref(null);
const currentComponent = shallowRef(null);

const handleClick = (component, data) => {
  currentComponent.value = component;
  selectedData.value = data;
};

onMounted(() => {
  currentComponent.value = UserBasic;
});
</script>

<style scoped></style>
