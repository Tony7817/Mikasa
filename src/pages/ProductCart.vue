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
              <q-img :src="c.imageUrl" style="width: 50px" fit="contain" />
              <div>
                <div style="font-size: 16px">{{ c.name }}</div>
                <q-badge class="size-picker" color="primary">
                  {{ c.size }}
                </q-badge>
                <q-menu>
                  <q-list
                    v-for="s in c.all_size"
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
              <q-btn icon="remove" flat dense />
              <div class="bg-gray">{{ c.num }}</div>
              <q-btn icon="add" flat dense />
            </div>
          </q-item-section>
          <q-item-section>
            <div class="text-h6" style="margin-left: -3px">
              {{ tool.getUnit(c.unit) }}{{ c.total }}
            </div>
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn icon="delete" flat dense color="secondary" />
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
                $293</q-item-section
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
    </div>
  </q-page>
</template>

<script setup>
import { tool } from "src/uril/tool";
import { ref } from "vue";

const cartList = ref([
  {
    id: "test1",
    name: "product1",
    imageUrl: "https://m.media-amazon.com/images/I/71Gi2kz4MQL._AC_SY879_.jpg",
    size: "XS",
    all_size: ["XS", "L", "XL"],
    price: 4.5,
    unit: "USD",
    num: 3,
    total: 13.5,
  },
  {
    id: "test2",
    name: "product2",
    imageUrl: "https://m.media-amazon.com/images/I/814q4L+ZnIL._AC_SY879_.jpg",
    size: "XXS",
    all_size: ["XS", "L", "XL"],
    price: 4.5,
    unit: "USD",
    num: 3,
    total: 13.5,
  },
]);
</script>

<style scoped>
.size-picker:hover {
  cursor: pointer;
}
</style>
