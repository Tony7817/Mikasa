<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="User" />
        <q-breadcrumbs-el label="Order" />
      </q-breadcrumbs>
    </div>
    <div>
      <q-list separator padding class="q-px-md">
        <q-item class="text-subtitle1 text-bold">
          <q-item-section class="col-1"></q-item-section>
          <q-item-section class="col">Products</q-item-section>
          <q-item-section class="col-2 text-center">Created At</q-item-section>
          <q-item-section class="col-2 text-center">Total Price</q-item-section>
          <q-item-section class="col-2 text-center">Status</q-item-section>
          <q-item-section class="col-1"></q-item-section>
        </q-item>
        <q-item v-for="(o, index) in orders" :key="o.id" class="text-body1">
          <q-item-section class="col-1">
            {{ index + idx }}
          </q-item-section>
          <q-item-section class="col">
            <div class="row items-center q-gutter-sm">
              <div v-for="i in o.cover_urls" :key="i">
                <q-img :src="i" fit="cover" style="height: 80px; width: 60px" />
              </div>
              <q-btn
                v-if="o.order_item_total > 3"
                class="text-body2"
                dense
                flat
                color="primary"
                @click="
                  router.push({
                    name: 'product-order',
                    params: { orderId: o.order_id },
                  })
                "
                >AND {{ o.order_item_total - 3 }} MORE</q-btn
              >
            </div>
          </q-item-section>
          <q-item-section class="col-2 text-center">
            {{ tool.formatTime(o.created_at) }}
          </q-item-section>
          <q-item-section class="col-2 text-center" style="padding-right: 10px">
            {{ Number(o.price) / 100 }} {{ tool.getUnit(o.unit) }}
          </q-item-section>
          <q-item-section class="col-2 text-center">
            <span :class="{'text-positive': o.status === OrderStatusPaid, 'text-warning': o.status !== OrderStatusPaid}">
              {{ o.status }}
            </span>
          </q-item-section>
          <q-space />
          <q-item-section class="col-1">
            <div class="row q-gutter-sm">
              <q-btn
                color="primary"
                icon="arrow_forward"
                @click="
                  router.push({
                    name: 'product-order',
                    params: { orderId: o.order_id },
                  })
                "
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <div
        v-if="orders.length === 0"
        class="text-center text-h3 q-my-lg text-bold"
      >
        NO ORDERS
      </div>
      <div class="q-pa-md row justify-center" v-if="totalPage > 0">
        <q-pagination
          v-model="page"
          :max="totalPage"
          direction-links
          flat
          color="grey"
          active-color="primary"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { OrderStatusPaid } from "src/composables/consts";
import { service } from "src/services/api";
import { tool } from "src/uril/tool";
import { onMounted } from "vue";
import { watch } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const orders = ref([]);
const total = ref(0);
const totalPage = ref(0);
const loading = ref(false);
const page = ref(1);
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const idx = ref(1);

watch(page, (newPage) => {
  router.push({ query: { page: newPage } });
  idx.value = (newPage - 1) * 20 + 1;
  onLoad(newPage);
});

async function onLoad(reqPage) {
  if (loading.value) return;

  loading.value = true;

  try {
    const response = await service.getOrderList({
      page: reqPage,
      page_size: 10,
    });
    const data = response.data.data;
    orders.value = data.orders;
    total.value = data.total;
    totalPage.value = Math.ceil(total.value / 20);
  } catch (error) {
    console.log(error);
    $q.notify({
      message: "Failed to load orders",
    });
  }

  loading.value = false;
}

onMounted(() => {
  onLoad(route.query.page || 1);
});
</script>

<style scoped></style>
