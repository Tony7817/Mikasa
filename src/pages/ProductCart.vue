<template>
  <q-page padding>
    <div>
      <div class="self-center text-h5 text-bold q-mb-lg">
        Your Cart({{ totalNum }})
      </div>
      <q-infinite-scroll @load="onLoad" :offset="250" :disable="!hasMore">
        <q-list separator>
          <q-item class="text-h6">
            <q-item-section class="col-1"></q-item-section>
            <q-item-section class="col-3">Item</q-item-section>
            <q-item-section class="col-1"></q-item-section>
            <q-item-section class="col-1">Size</q-item-section>
            <q-item-section class="col-1">Price</q-item-section>
            <q-item-section class="col-2">Quantity</q-item-section>
            <q-item-section class="col-1">Total</q-item-section>
            <q-item-section class="col-1"></q-item-section>
          </q-item>
          <q-item v-for="c in cartList" :key="c.id" class="row items-center">
            <q-item-section class="col-1 row items-center">
              <div v-if="!c._isOutOfStock">
                <q-checkbox v-model="c._selected" dense />
              </div>
            </q-item-section>
            <q-item-section class="col-3">
              <div class="row q-gutter-sm no-wrap" style="max-height: 150px">
                <q-img
                  class="col-6"
                  :src="c.cover_url"
                  style="width: 100px"
                  fit="contain"
                  @click="ToProductDetailPage(c.star_id, c.product_id)"
                />
                <div class="col">
                  <div class="column" style="height: 100%">
                    <div
                      style="font-size: 16px; cursor: pointer"
                      :class="{ delete: c._isOutOfStock }"
                    >
                      {{ c.description }}
                    </div>
                    <div class="row q-gutter-sm q-mt-xs">
                      <q-badge
                        v-if="c.stock < 10 && c.stock > 0"
                        color="primary"
                        class="text-bold"
                        style="font-size: 16px"
                        >Only {{ c.stock }} left in stock!</q-badge
                      >
                      <q-badge
                        color="warning"
                        text-color="primary"
                        class="text-bold"
                        v-if="c.stock <= 0"
                        style="font-size: 16px"
                      >
                        Out of stock
                      </q-badge>
                    </div>
                  </div>
                </div>
              </div>
            </q-item-section>
            <q-item-section class="col-1"></q-item-section>
            <q-item-section class="col-1">
              <div>
                <q-badge
                  class="size-picker text-body text-bold"
                  color="primary"
                  :class="{ delete: c._isOutOfStock }"
                >
                  {{ c.size }}
                </q-badge>
              </div>
            </q-item-section>
            <q-item-section class="col-1">
              <div
                class="text-h6"
                style="margin-left: -5px"
                :class="{ delete: c._isOutOfStock }"
              >
                {{ tool.getUnit(c.unit) }}{{ c.priceFinal }}
              </div>
            </q-item-section>
            <q-item-section class="col-2">
              <div
                class="row q-gutter-sm items-center"
                style="margin-left: -16px"
              >
                <q-btn
                  v-if="!c._isOutOfStock"
                  icon="remove"
                  flat
                  dense
                  @click="decreaseAmount(c)"
                  :disable="c._isOutOfStock || c.amountLoading || c.amount <= 1"
                />
                <q-spinner v-if="c.amountLoading" color="purple" />
                <div
                  v-else
                  class="bg-gray"
                  :class="{ delete: c._isOutOfStock }"
                >
                  <div :class="{ warning: c._exceedStock }">
                    {{ c.amount }}
                  </div>
                </div>
                <q-btn
                  v-if="!c._isOutOfStock"
                  icon="add"
                  flat
                  dense
                  @click="addAmount(c)"
                  :disable="c._isOutOfStock"
                />
              </div>
              <div v-if="c.stock < c.amount" class="text-warning text-bold">
                EXCEED IN STOCK
              </div>
            </q-item-section>
            <q-item-section class="col-1">
              <div
                class="text-h6"
                style="margin-left: -3px"
                :class="{ delete: c._isOutOfStock }"
              >
                {{ tool.getUnit(c.unit) }}{{ c.totalPriceFinal }}
              </div>
            </q-item-section>
            <q-item-section class="col-1">
              <q-btn
                icon="delete"
                flat
                dense
                color="secondary"
                :disable="removeProductLoading"
                @click="ShowRemoveProductDialog(c.product_id, c.color_id)"
              />
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </q-infinite-scroll>
      <div class="row justify-end q-mt-sm">
        <div class="col-2">
          <q-item class="row text-h5">
            <q-item-section> Amount </q-item-section>
            <q-item-section side class="text-bold">
              {{ selectedAmount }}</q-item-section
            >
          </q-item>
          <q-separator />
          <q-item class="row text-h5">
            <q-item-section> Total </q-item-section>
            <q-item-section side class="text-bold">
              ${{ TotalPrice }}</q-item-section
            >
          </q-item>
          <q-item>
            <q-item-section>
              <q-btn
                label="Checkout"
                color="primary"
                class="q-mt-md"
                @click="checkout"
              />
            </q-item-section>
          </q-item>
        </div>
        <div class="col-1"></div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { service } from "src/services/api";
import { useUserStore } from "src/stores/user";
import { tool } from "src/uril/tool";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";

const userStore = useUserStore();
const currentPage = ref(1);
const cartList = ref([]);
const $q = useQuasar();
const amountLoading = ref(false);
const removeProductLoading = ref(false);
const router = useRouter();
const totalNum = ref(0);
const loading = ref(false);
const hasMore = ref(true);
const requestId = uuidv4();

function InitFilter(products) {
  products.forEach((p) => {
    p._amountLoading = false;
    p._selected = false;
    p._isOutOfStock = false;
    p._exceedStock = false;
    p.totalPriceFinal = computed(() => {
      return (p.total_price / 100).toFixed(2);
    });
    p.priceFinal = computed(() => {
      return (p.price / 100).toFixed(2);
    });
  });
}

const selectedAmount = computed(() => {
  var amount = 0;
  cartList.value.forEach((c) => {
    if (c._selected) {
      amount++;
    }
  });
  return amount;
});

const TotalPrice = computed(() => {
  var price = 0;
  cartList.value.forEach((c) => {
    if (c._selected) {
      price += c.total_price;
    }
  });
  return tool.formatPrice(price);
});

async function addAmount(productCart) {
  if (productCart.amountLoading) {
    return;
  }
  productCart.amountLoading = true;
  try {
    const response = await service.addAmount({
      product_id: productCart.product_id,
      color_id: productCart.color_id,
      size: productCart.size,
      expected_amount: productCart.amount + 1,
    });
    const data = response.data.data;
    const p = cartList.value.find((c) => c.id === data.cart_id);
    if (p) {
      p.amount = data.amount;
      p.total_price = data.total_price;
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "something went wrong",
      position: "top",
    });
  }
  productCart.amountLoading = false;
}

async function decreaseAmount(productCart) {
  if (productCart.amountLoading) {
    return;
  }

  productCart.amountLoading = true;
  try {
    const response = await service.decreaseAmount({
      product_id: productCart.product_id,
      color_id: productCart.color_id,
      size: productCart.size,
    });
    const data = response.data.data;
    const p = cartList.value.find((p) => p.id === data.product_id);
    if (p) {
      p.amount = data.amount;
      p.total_price = data.total_price;
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "error",
      position: "top",
    });
  }
  productCart.amountLoading = false;
}

async function onLoad(index, done) {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const response = await service.getCartList({
      user_id: userStore.user.id,
      page: index,
      page_size: 20,
    });
    const data = response.data.data;
    cartList.value = data.products;
    totalNum.value = data.total;
    if (data.products.length < 20) {
      hasMore.value = false;
    }
    InitFilter(cartList.value);
    // check stock
    var isStockExceed = false;
    cartList.value.forEach((c) => {
      if (c.stock < c.amount) {
        c._exceedStock = true;
        isStockExceed = true;
      }
      if (c.stock <= 0) {
        c._isOutOfStock = true;
      }
    });
    if (isStockExceed) {
      $q.notify({
        type: "warning",
        message: "Some products exceeds available stock. Please check",
        position: "top",
      });
    }
  } catch (error) {
    if (error.response?.status == 401) {
      userStore.clearUser();
    } else {
      $q.notify({
        type: "negative",
        message: "error",
        position: "top",
      });
    }
  }

  loading.value = false;
  done();
}

async function removeProduct(productId, colorId) {
  if (removeProductLoading.value) {
    return;
  }

  removeProductLoading.value = true;

  try {
    const response = await service.removeProductFromCart({
      product_id: productId,
      color_id: colorId,
    });
    const data = response.data.data;
    const idx = cartList.value.findIndex((c) => c.id === data.id);
    if (idx !== -1) {
      cartList.value.splice(idx, 1);
    }
    totalNum.value--;
    $q.notify({
      type: "positive",
      message: "success",
      position: "top",
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "error",
      position: "top",
    });
  }

  removeProductLoading.value = false;
}

function ToProductDetailPage(starId, productId) {
  router.push(`/star/${starId}/product/${productId}`);
}

function ShowRemoveProductDialog(productId, colorId) {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to remove this product?",
  }).onOk(async () => {
    await removeProduct(productId, colorId);
  });
}

const isCheckingout = ref(false);
async function checkout() {
  if (isCheckingout.value) {
    return;
  }

  isCheckingout.value = true;

  var isProductSelected = false;
  cartList.value.forEach((c) => {
    if (c._selected) {
      isProductSelected = true;
    }
  });
  if (!isProductSelected) {
    $q.notify({
      type: "negative",
      message: "Please select at least one product",
      position: "top",
    });
    isCheckingout.value = false;
    return;
  }

  var selectedProducts = [];
  cartList.value.forEach((c) => {
    if (c._selected) {
      selectedProducts.push({
        product_id: c.product_id,
        color_id: c.color_id,
        size: c.size,
        quantity: c.amount,
      });
    }
  });
  try {
    const response = await service.createOrder({
      request_id: requestId,
      orders: selectedProducts,
    });
    const data = response.data.data;
    console.log(data);
  } catch (error) {
    console.log(error);
    $q.notify({
      message: "create order failed",
    });
  }

  isCheckingout.value = false;
}

onMounted(() => {
  onLoad();
});
</script>

<style scoped>
.size-picker:hover {
  cursor: pointer;
}

.delete {
  text-decoration: line-through;
}

.warning {
  color: red;
}
</style>
