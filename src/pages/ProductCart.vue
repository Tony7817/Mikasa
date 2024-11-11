<template>
  <q-page padding>
    <div>
      <div class="self-center text-h5 text-bold q-mb-lg">Your Cart</div>
      <div class="text-h6 row items-center" style="padding: 8px 16px">
        <div class="col-6">Item</div>
        <div class="col">Price</div>
        <div class="col">Quantity</div>
        <div class="col">Total</div>
        <div class="col-1"></div>
      </div>
      <q-separator />
      <q-list v-for="c in cartList" :key="c.id">
        <q-item class="row items-center">
          <q-item-section class="col-6">
            <div class="row q-gutter-sm">
              <q-img
                :src="c.image_url"
                style="width: 50px"
                fit="contain"
                @click="ToProductDetailPage(c.star_id, c.product_id)"
              />
              <div>
                <div style="font-size: 16px; cursor: pointer">
                  {{ c.name }}
                </div>
                <q-badge class="size-picker" color="primary">
                  {{ c.size }}
                  <q-menu>
                    <q-list
                      v-for="s in c._all_size"
                      :key="s"
                      dense
                      style="min-width: 100px"
                    >
                      <q-item clickable v-close-popup>
                        <q-item-section @click="c.size = s">{{
                          s
                        }}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-badge>
              </div>
            </div>
          </q-item-section>
          <q-item-section>
            <div class="text-h6" style="margin-left: -5px">
              {{ tool.getUnit(c.unit) }}{{ c.price }}
            </div>
          </q-item-section>
          <q-item-section>
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
          <q-item-section>
            <div class="text-h6" style="margin-left: -3px">
              {{ tool.getUnit(c.unit) }}{{ (c.amount * c.price).toFixed(2) }}
            </div>
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn
              icon="delete"
              flat
              dense
              color="secondary"
              :disable="removeProductLoading"
              @click="ShowRemoveProductDialog(c.id)"
            />
          </q-item-section>
        </q-item>
        <q-separator />
      </q-list>
      <div class="row justify-end q-mt-sm">
        <div class="col-2">
          <q-list dense>
            <q-item class="row">
              <q-item-section> Amount </q-item-section>
              <q-item-section side> 23</q-item-section>
            </q-item>
            <q-separator />
            <q-item class="row">
              <q-item-section> Total </q-item-section>
              <q-item-section side class="text-h6 text-black text-bold">
                ${{ totalMoney }}</q-item-section
              >
            </q-item>
            <q-item>
              <q-item-section>
                <q-btn
                  label="Checkout"
                  color="primary"
                  icon="shopping_cart"
                  icon-right
                  class="q-mt-md"
                />
              </q-item-section>
            </q-item>
          </q-list>
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

function InitFilter(products) {
  products.forEach((p) => {
    p._amountLoading = false;
    p._all_size = p.all_size.split(",");
  });
}

const totalMoney = computed(() => {
  return cartList.value
    .reduce((acc, p) => acc + p.amount * p.price, 0)
    .toFixed(2);
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
      size: 20,
    });
    const data = response.data.data;
    cartList.value = data.products;
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

async function removeProduct(productCartId) {
  if (removeProductLoading.value) {
    return;
  }

  removeProductLoading.value = true;

  try {
    const response = await service.removeProductFromCart(productCartId, {});
    const data = response.data.data;
    const idx = cartList.value.findIndex((c) => c.id === data.id);
    if (idx !== -1) {
      cartList.value.splice(idx, 1);
    }
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

function ShowRemoveProductDialog(productCartId) {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to remove this product?",
  }).onOk(async () => {
    await removeProduct(productCartId);
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
