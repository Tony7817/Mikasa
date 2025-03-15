<template>
  <q-page>
    <div class="row q-gutter-md">
      <div class="col-6 q-pl-md">
        <div class="row items-center q-gutter-md">
          <div class="text-bold text-h5">Order Detail</div>
          <div
            v-if="order.status === 'pending'"
            class="text-body2 text-bold text-warning"
          >
            Your order hasn't paid
          </div>
        </div>
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
              <div
                class="q-pa-md"
                style="border: 1px solid #5c5a60; border-radius: 15px"
              >
                <div class="row">
                  <q-img
                    class="col-2"
                    :src="o.product_cover_url"
                    fit="cover"
                    height="100%"
                    style="height: 100px"
                  />
                  <div class="col column q-gutter-xs">
                    <div class="text-body2 text-bold">
                      {{ o.product_description }}
                    </div>
                    <div>
                      <q-badge class="text-bold">X {{ o.quantity }}</q-badge>
                    </div>
                  </div>
                </div>
                <div
                  class="row items-center q-gutter-md text-bold text-body1 q-mt-sm"
                >
                  <div>
                    Price:
                    {{ tool.formatPrice(o.price) }}
                    {{ tool.getUnit(order.unit) }}
                  </div>
                  <div>
                    Size:
                    <q-badge>{{ o.size }}</q-badge>
                  </div>
                  <div>
                    Color:
                    <q-badge>{{ o.color }}</q-badge>
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
        <div>
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
import { useQuasar, Loading } from "quasar";
import { service } from "src/services/api";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import { tool } from "src/uril/tool";
import { OrderStatusPaid } from "src/composables/consts";

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
      async onShippingAddressChange(data) {
        try {
          console.log("address changed, ", data);
        } catch (error) {}
      },
      async onApprove(data) {
        console.log("data: ", data);

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

  Loading.show();
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
  Loading.hide();
}

async function loadPaypalScript(maxRetries = 3, retryDelay = 2000) {
  if (!window.paypal) {
    let retries = 0;
    paypalloading.value = true; // 开始加载时设置为true

    const loadScript = async () => {
      try {
        const script = document.createElement("script");
        script.src =
          "https://www.paypal.com/sdk/js?client-id=ATPwrmvOxlXlvqhTMXz-N9AlEBR2yiZ3HlA2VlDj405OIfioMmGVa4dDICoON-s-aRtvAEt7otUKt7oj&components=buttons";
        script.async = true;

        // 使用Promise包装script加载
        const scriptLoadPromise = new Promise((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Paypal SDK loading failed"));
        });

        document.head.appendChild(script);

        // 等待script加载完成
        await scriptLoadPromise;

        // 加载成功后初始化按钮
        initPaypalButtons();
        paypalloading.value = false; // 加载完成设置为false
      } catch (error) {
        retries++;
        console.error(
          `Paypal loading failed, attempt ${retries}/${maxRetries}`,
          error
        );

        if (retries < maxRetries) {
          // 等待一段时间后重试
          paypalloading.value = true; // 保持加载状态
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return loadScript();
        } else {
          // 达到最大重试次数
          paypalloading.value = false;
          console.error("Paypal SDK failed to load after maximum retries");
          // 这里可以添加额外的错误处理逻辑
          throw error;
        }
      }
    };

    return loadScript();
  } else {
    paypalloading.value = true; // 短暂显示加载状态
    try {
      initPaypalButtons(); // 直接调用初始化函数
      paypalloading.value = false; // 初始化完成后关闭加载状态
      return; // 提前返回
    } catch (error) {
      console.error(
        "Failed to initialize PayPal buttons with existing SDK:",
        error
      );
      paypalloading.value = false;
      throw error; // 如果初始化失败，抛出错误
    }
  }
}

onMounted(async () => {
  await onLoad();
  if (order.value.status === OrderStatusPaid) {
    const response = await service.getOrderAddress(props.orderId);
    const data = response.data.data;
    payerInfo.value = data.address;
  } else {
    await loadPaypalScript();
  }
});
</script>

<style scoped></style>
