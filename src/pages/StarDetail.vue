<template>
  <q-page padding style="background-color: #f4f6f8">
    <div class="row" style="background-color: white">
      <div class="col-1 q-pa-sm">
        <q-img
          src="https://cdn.quasar.dev/img/avatar2.jpg"
          style="width: 80px; height: 80px"
          fit="contain"
        />
      </div>
      <div class="col">
        <div class="column q-pa-sm">
          <span class="text-h6">Ava</span>
          <span
            >Hope you like my product! If you like them, please subscribe
            me.</span
          >
        </div>
      </div>
      <div class="self-center" style="width: 10%">
        <q-btn label="Follow" color="secondary" icon="add" />
      </div>
    </div>
    <!--Product list-->
    <div class="row q-mt-md">
      <div class="q-mr-sm" style="width: 15%">
        <q-card flat>
          <q-card-section>
            Twiter <a class="text-primary" href="">@Ruby</a>
          </q-card-section>
        </q-card>
      </div>
      <div class="col" style="background-color: white">
        <div class="row justify-center">
          <div class="row q-mt-sm q-pa-sm q-gutter-xl">
            <ProductItem
              class="q-mt-sm"
              v-for="p in products"
              :key="p.link"
              :id="p.id"
              :link="p.link"
              :desc="p.desc"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import ProductItem from "src/components/ProductItem.vue";

defineOptions({
  name: "StarDetail",
});

const products = ref([
  {
    id: "1",
    desc: "Avidlove Lingerie for Women Lace Corset and Panty Outfits Garter Lingerie Sets S-XXL",
    link: "https://m.media-amazon.com/images/I/71Gi2kz4MQL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    id: "2",
    desc: "Women's Sexy Lace Lingerie Set with Garter Belt Bodysuit Teddy and Panty",
    link: "https://m.media-amazon.com/images/I/71W41oCRhEL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    id: "3",
    desc: "Avidlove Lingerie Set for Women Sexy Lace Two Piece Lingerie Outfits with Tie Top and Mini Pleated Skirt Set",
    link: "https://m.media-amazon.com/images/I/81NSaKV5NIL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    id: "4",
    desc: "Women's Sexy Lingerie 3 Piece Lingerie Set with Garter Belt Stockings and Panty",
    link: "https://m.media-amazon.com/images/I/61Se3tROZqL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    id: "5",
    desc: "Avidlove Lingerie for Women Lace Babydoll Sleepwear Boudoir Outfits Plus Size Langeray XS-5XL",
    link: "https://m.media-amazon.com/images/I/71CcRiu6vVL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    id: "6",
    desc: "Lilosy Sexy Underwire Floral Lace Sheer Lingerie Set for Women See Through Bra and Panty 2 Piece",
    link: "https://m.media-amazon.com/images/I/712KXig5GyL._AC_UL640_FMwebp_QL65_.jpg",
  },
]);
</script>

<style></style>
