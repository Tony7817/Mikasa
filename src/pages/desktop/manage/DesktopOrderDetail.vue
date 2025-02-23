<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="User" />
        <q-breadcrumbs-el label="Order" />
        <q-breadcrumbs-el :label="props.orderId" />
      </q-breadcrumbs>
    </div>
    <div>
      <q-list separator padding class="q-px-md">
        <q-item>
          <q-item-section class="col-5">Product</q-item-section>
          <q-item-section class="col-1">Price</q-item-section>
          <q-item-section class="col-1">Quantity</q-item-section>
          <q-item-section class="col-1">Size</q-item-section>
          <q-item-section class="col"></q-item-section>
        </q-item>
        <q-item v-for="i in items" :key="i.id">
          <q-item-section class="col-5">
            <div class="row items-start q-gutter-sm">
              <div class="col-2">
                <q-img :src="i.product_cover" fit="contain" />
              </div>
              <div class="col">{{ i.product_description }}</div>
            </div>
          </q-item-section>
          <q-item-section class="col-1">
            {{ Number(i.price) / 100 }} {{ i.unit }}
          </q-item-section>
          <q-item-section class="col-1">
            {{ i.quantity }}
          </q-item-section>
          <q-item-section class="col-1">{{ i.size }} </q-item-section>
          <q-item-section>
            <div class="row">
              <q-btn label="Return" flat color="primary" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { service } from "src/services/api";
import { onMounted } from "vue";
import { ref } from "vue";

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
});

const items = ref([]);
const loading = ref(false);
const $q = useQuasar();

async function onLoad() {
  if (loading.value) return;

  loading.value = true;

  try {
    const response = await service.getOrderItems(props.orderId);
    const data = response.data.data;
    items.value = data.order_items;
  } catch (error) {
    $q.notify({
      message: error.response.data.message || "Failed to load order items",
    });
  }

  loading.value = false;
}

onMounted(() => {
  onLoad();
});
</script>

<style scoped></style>
