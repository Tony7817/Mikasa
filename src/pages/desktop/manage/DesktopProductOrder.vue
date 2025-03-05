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
        <q-item>
          <q-item-section class="col-1"></q-item-section>
          <q-item-section class="col-3">Order Id</q-item-section>
          <q-item-section class="col-2">Total Price</q-item-section>
          <q-item-section class="col-2">Status</q-item-section>
          <q-item-section class="col"></q-item-section>
          <q-item-section class="col-1">Action</q-item-section>
        </q-item>
        <q-item v-for="(o, index) in orders" :key="o.id">
          <q-item-section class="col-1">
            {{ index + 1 }}
          </q-item-section>
          <q-item-section class="col-3" style="font-family: monospace">
            {{ o.order_id }}
          </q-item-section>
          <q-item-section class="col-2">
            {{ Number(o.price) / 100 }} {{ tool.getUnit(o.unit) }}
          </q-item-section>
          <q-item-section class="col-2">
            {{ o.status }}
          </q-item-section>
          <q-space />
          <q-item-section class="col-1">
            <q-btn
              label="Detail"
              color="primary"
              @click="
                router.push({
                  name: 'UserOrderDetail',
                  params: { orderId: o.order_id },
                })
              "
            />
          </q-item-section>
        </q-item>
      </q-list>
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
import { service } from "src/services/api";
import { tool } from "src/uril/tool";
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const orders = ref([]);
const total = ref(0);
const totalPage = ref(0);
const loading = ref(false);
const page = ref(1);
const $q = useQuasar();
const router = useRouter();

async function onLoad() {
  if (loading.value) return;

  loading.value = true;

  try {
    const response = await service.getOrderList({
      page: page.value,
      page_size: 20,
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
  onLoad();
});
</script>

<style scoped></style>
