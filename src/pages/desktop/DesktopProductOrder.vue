<template>
  <q-page>
    <div class="row q-gutter-md">
      <div class="col-6 q-pl-md">
        <div class="text-bold text-h5 q-mb-md">Order Detail</div>
        <div>
          <q-card flat bordered>
            <q-card-section>
              <div class="row q-mb-lg q-gutter-md items-center">
                <div class="col-2">
                  <q-badge class="text-subtitle1 text-bold">Order ID</q-badge>
                </div>
                <q-separator vertical />
                <div class="text-body1 text-bold">
                  {{ order.request_id }}
                </div>
              </div>
              <div class="row q-mb-lg q-gutter-md items-center">
                <div class="col-2">
                  <q-badge class="text-subtitle1 text-bold">Status</q-badge>
                </div>
                <q-separator vertical />
                <div class="text-body1 text-bold">{{ order.status }}</div>
              </div>
              <div class="row q-gutter-md items-center">
                <div class="col-2">
                  <q-badge class="text-bold text-subtitle1">Price</q-badge>
                </div>
                <q-separator vertical />
                <div class="text-body1 text-bold">
                  {{ tool.formatPrice(order.price) }}
                  {{ tool.getUnit(order.unit) }}
                </div>
              </div>
            </q-card-section>
            <q-separator class="q-mx-md" />
            <q-card-section v-for="o in orderItems" :key="o.product_id">
              <div class="row">
                <q-img
                  class="col-2"
                  :src="o.product_cover_url"
                  fit="contain"
                  height="100%"
                  style="height: 100px"
                />
                <div class="col">
                  <div class="text-body2 text-bold">
                    {{ o.product_description }}
                  </div>
                  <div class="row q-gutter-md items-center q-mt-sm">
                    <q-badge class="text-bold">{{ o.size }}</q-badge>
                    <q-badge class="text-bold">{{ o.color }}</q-badge>
                  </div>
                  <div class="row q-gutter-md items-center q-mt-sm">
                    <div class="text-bold text-body1">
                      {{ tool.formatPrice(o.price) }}
                      {{ tool.getUnit(order.unit) }}
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-separator vertical />
      <div class="col q-pr-md" v-if="order.status === 'pending'">
        <q-spinner v-if="paypalloading" />
        <div v-if="!paypalloading">
          <div class="text-bold text-h6 q-mb-md">Pay Your Order</div>
          <div id="paypal-button-container"></div>
        </div>
      </div>
      <div v-else-if="order.status === 'paid'" class="col q-pr-md">
        <div class="text-h5 text-bold q-mb-md">Address</div>
        <div class="q-mb-md" v-if="payerInfo.email">
          Your order details has been sent to your email
          {{ payerInfo.email }}
        </div>
        <q-card flat bordered>
          <q-card-section class="row q-gutter-md items-center">
            <q-badge class="text-subtitle1 text-bold">Name</q-badge>
            <div>{{ payerInfo.full_name }}</div>
          </q-card-section>
          <q-card-section class="row q-gutter-md items-center">
            <q-badge class="text-subtitle1 text-bold">Address</q-badge>
            <div>
              {{ payerInfo.address_line_1 }} {{ payerInfo.address_line_2 }}
            </div>
          </q-card-section>
          <q-card-section class="row q-gutter-md items-center">
            <q-badge class="text-subtitle1 text-bold">Address</q-badge>
            <div>{{ payerInfo.admin_area_1 }} {{ payerInfo.admin_area_2 }}</div>
          </q-card-section>
          <q-card-section class="row q-gutter-md items-center">
            <q-badge class="text-subtitle1 text-bold">Shipping Status</q-badge>
            <div>Shipping</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from "vue";
import { useQuasar } from "quasar";
import { service } from "src/services/api";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import { tool } from "src/uril/tool";

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
});

const requestId = uuidv4();
const $q = useQuasar();
const payOrderId = ref("");
const loading = ref(false);
const paypalloading = ref(false);
const order = ref({
  request_id: "",
});
const orderItems = ref([]);
const payerInfo = ref({
  email: "",
});

const initPaypalButtons = () => {
  window.paypal
    .Buttons({
      style: {
        shape: "rect",
        layout: "vertical",
        color: "gold",
        label: "paypal",
      },
      message: {
        amount: 100,
      },
      async createOrder() {
        try {
          const response = await service.createPaypalOrder({
            order_id: props.orderId,
            request_id: requestId,
          });
          const data = response.data.data;
          if (data.paypal_order_id) {
            payOrderId.value = data.paypal_order_id;
            return data.paypal_order_id;
          }
        } catch (error) {
          console.log(error);
          $q.notify({
            message: error?.response?.data?.msg || "Failed to create order",
          });
        }
      },
      async onApprove() {
        try {
          const response = await service.captureOrder({
            order_id: props.orderId,
            paypal_order_id: payOrderId.value,
          });
          const data = response.data.data;
          if (data.status === "COMPLETED") {
            $q.notify({
              type: "positive",
              message: "Order completed",
              position: "top",
            });
          }
          onLoad();
        } catch (error) {
          $q.notify({
            type: "negative",
            message: error?.response?.data?.msg || "Failed to capture order",
            position: "top",
          });
        }
      },
    })
    .render("#paypal-button-container");
};

async function onLoad() {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const response = await service.getOrderDetail(props.orderId);
    const data = response.data.data;
    order.value = data.order;
    orderItems.value = data.order_items;
  } catch (error) {
    console.log(error);
    $q.notify({
      position: "top",
      type: "negative",
      message: error?.response?.data?.msg || "Failed to get order detail",
    });
  }

  loading.value = false;
}

onMounted(async () => {
  await onLoad();
  if (order.value.status === "paid") {
    const response = await service.getOrderAddress(props.orderId);
    const data = response.data.data;
    payerInfo.value = data.address;
    console.log(payerInfo.value);
  } else {
    if (!window.paypal) {
      paypalloading.value = true;
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=ATPwrmvOxlXlvqhTMXz-N9AlEBR2yiZ3HlA2VlDj405OIfioMmGVa4dDICoON-s-aRtvAEt7otUKt7oj&currency=USD";
      script.async = true;
      script.onload = async () => {
        initPaypalButtons();
      };
      document.head.appendChild(script);
      paypalloading.value = false;
    }
  }
});
</script>

<style scoped></style>
