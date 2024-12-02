<template>
  <q-page style="background-color: #f2f2f2; padding: 10px 10px 0px 10px">
    <div class="row q-gutter-sm">
      <div
        class="column q-getter-sm col-2 q-pa-sm"
        style="background-color: white; height: 100vh"
      >
        <q-list style="max-width: 350px">
          <q-item clickable>
            <q-item-section avatar="">
              <q-icon color="primary" name="person" />
            </q-item-section>
            <q-item-section> Basic </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col" style="background-color: white; height: 100vh">
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
import { onMounted, ref } from "vue";
import UserBasic from "src/components/Desktop/UserBasic.vue";

const selectedData = ref(null);
const currentComponent = ref(null);

const handleClick = (component, data) => {
  currentComponent.value = component;
  selectedData.value = data;
};

onMounted(() => {
  currentComponent.value = UserBasic;
});
</script>

<style scoped></style>
