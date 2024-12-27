<template>
  <q-page padding>
    <div>
      <div class="self-center text-h5 text-bold q-mb-lg">
        Your Cart({{ totalNum }})
      </div>
      <q-list v-for="c in cartList" :key="c.id" separator>
        <q-item class="text-h6">
          <q-item-section class="col-1" style="width: 40px"></q-item-section>
          <q-item-section class="col-4">Item</q-item-section>
          <q-item-section class="col-1"></q-item-section>
          <q-item-section class="col-2">Price</q-item-section>
          <q-item-section class="col-2">Quantity</q-item-section>
          <q-item-section class="col-1">Total</q-item-section>
          <q-item-section class="col-1"></q-item-section>
        </q-item>
        <q-item class="row items-center">
          <q-item-section class="col-1 row items-center" style="width: 40px">
            <div>
              <q-checkbox v-model="c._selected" dense />
            </div>
          </q-item-section>
          <q-item-section class="col-4">
            <div class="row q-gutter-sm no-wrap">
              <q-img
                class="col-6"
                :src="c.cover_url"
                style="width: 100px"
                fit="contain"
                @click="ToProductDetailPage(c.star_id, c.product_id)"
              />
              <div class="col">
                <div class="column" style="height: 100px">
                  <div style="font-size: 16px; cursor: pointer">
                    {{ c.description }}
                  </div>
                  <q-space />
                  <div class="row q-gutter-sm">
                    <span>Size:</span>
                    <q-badge class="size-picker" color="primary">
                      {{ c.size }}
                    </q-badge>
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
          <q-item-section class="col-1"></q-item-section>
          <q-item-section class="col-2">
            <div class="text-h6" style="margin-left: -5px">
              {{ tool.getUnit(c.unit) }}{{ c.price }}
            </div>
          </q-item-section>
          <q-item-section class="col-2">
            <div
              class="row q-gutter-sm items-center"
              style="margin-left: -16px"
            >
              <q-btn icon="remove" flat dense @click="decreaseAmount(c)" />
              <q-spinner v-if="c.amountLoading" color="purple" />
              <div v-else class="bg-gray">{{ c.amount }}</div>
              <q-btn icon="add" flat dense @click="addAmount(c)" />
            </div>
          </q-item-section>
          <q-item-section class="col-1">
            <div class="text-h6" style="margin-left: -3px">
              {{ tool.getUnit(c.unit) }}{{ c.total_price }}
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
              <q-btn label="Checkout" color="primary" class="q-mt-md" />
            </q-item-section>
          </q-item>
        </div>
        <div class="col-1"></div>
      </div>
      <div v-if="cartList.length > 20" class="row justify-center q-mt-lg">
        <q-pagination v-model="currentPage" :max="9" direction-links />
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

const userStore = useUserStore();
const currentPage = ref(1);
const cartList = ref([]);
const $q = useQuasar();
const amountLoading = ref(false);
const removeProductLoading = ref(false);
const router = useRouter();
const totalNum = ref(0);

function InitFilter(products) {
  products.forEach((p) => {
    p._amountLoading = false;
    p._selected = false;
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
  return price;
});

async function addAmount(productCart) {
  if (productCart.amountLoading) {
    return;
  }
  productCart.amountLoading = true;
  try {
    const response = await service.addAmount(productCart.id, {});
    const data = response.data.data;
    const p = cartList.value.find((c) => c.id === data.cart_id);
    if (p) {
      p.amount = data.amount;
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

async function decreaseAmount(productCart) {
  if (productCart.amountLoading) {
    return;
  }

  productCart.amountLoading = true;
  try {
    const response = await service.decreaseAmount(productCart.id, {});
    const data = response.data.data;
    const p = cartList.value.find((p) => p.id === data.product_id);
    if (p) {
      p.amount = data.amount;
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

async function onLoad() {
  try {
    const response = await service.getCartList({
      user_id: userStore.user.id,
      page: currentPage.value,
      page_size: 20,
    });
    const data = response.data.data;
    cartList.value = data.products;
    totalNum.value = data.total;
    InitFilter(cartList.value);
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

onMounted(() => {
  onLoad();
});
</script>

<style scoped>
.size-picker:hover {
  cursor: pointer;
}
</style>
