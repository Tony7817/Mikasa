<template>
  <q-page>
    <div>
      <div class="text-h5 text-bold q-mb-lg">Confirm Your Order</div>
      <div id="paypal-button-container"></div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from "vue";
import { Loading, useQuasar } from "quasar";
import { service } from "src/services/api";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
});

const requestId = uuidv4();
const $q = useQuasar();
const payOrderId = ref("");

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
        console.log("onApprove");
      },
    })
    .render("#paypal-button-container");
};

onMounted(async () => {
  if (!window.paypal) {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=ATPwrmvOxlXlvqhTMXz-N9AlEBR2yiZ3HlA2VlDj405OIfioMmGVa4dDICoON-s-aRtvAEt7otUKt7oj&currency=USD";
    script.async = true;
    script.onload = async () => {
      initPaypalButtons();
    };
    document.head.appendChild(script);
  }
});
</script>

<style scoped></style>
