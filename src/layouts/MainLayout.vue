<template>
  <q-layout view="hHh Lpr fFf">
    <q-header
      elevated
      style="background: linear-gradient(45deg, #cb2a45, #2a4a82)"
    >
      <q-toolbar>
        <q-toolbar-title class="col-1"> Miss Lover </q-toolbar-title>
        <q-input
          class="col-4 q-ml-md q-mr-md bg-white"
          v-model="searchInput"
          filled
          placeholder="Search..."
          dense
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-btn round dense flat label="Go" />
          </template>
        </q-input>
        <q-space />
        <q-btn dense flat icon="person" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <div class="row">
          <div class="col-3">
            <div class="q-pl-md q-pa-md">
              <div class="text-h7 text-weight-bold q-mb-xs">Department</div>
              <div class="text-h7 link-hover">Women's Exotic Apparel</div>
              <div class="text-h7 text-indent link-hover">
                Women's Exotic Lingerie Sets
              </div>
              <div class="text-h7 text-indent link-hover">
                Women's Exotic Teddies & Bodysuits
              </div>
              <div class="text-h7 link-hover">Women's Fashion</div>
              <div class="text-h7 text-indent link-hover">
                Women's Lingerie Sets
              </div>
              <div class="text-h7 text-indent link-hover">
                Women's Chemises & Negligees
              </div>
              <div class="text-h7 text-indent link-hover">
                Women's Pajama Sets
              </div>
              <q-separator class="q-my-md" />
              <div class="text-h7 text-weight-bold q-mb-xs">Brand</div>
              <div class="column q-gutter-xs">
                <q-checkbox
                  v-for="b in brandFilter"
                  :key="b.label"
                  v-model="b.value"
                  :label="b.label"
                  dense
                />
                <q-separator class="q-my-md" />
                <div class="text-h7 text-weight-bold q-mb-xs">
                  Women's General Clothing Size
                </div>
                <div class="row q-gutter-xs q-ml-none">
                  <q-btn
                    v-for="s in scales"
                    :key="s.label"
                    :label="s.label"
                    flat
                    outline
                    dense
                    :style="{
                      backgroundColor:
                        selectedBtn === s.value ? '#CB2A45' : 'white',
                      color: selectedBtn === s.value ? 'white' : 'black',
                      width: '36px',
                    }"
                    @click="selectedBtn = s.value"
                  />
                </div>
                <q-separator class="q-my-md" />
                <div class="text-h7 text-weight-bold q-mb-xs">Closure Type</div>
                <q-checkbox
                  v-for="c in closures"
                  :key="c.label"
                  v-model="c.value"
                  :label="c.label"
                  dense
                />
              </div>
            </div>
          </div>
          <div class="col">
            <div class="row justify-center">
              <div class="row q-mt-sm q-pa-sm q-gutter-xl">
                <ProductItem
                  class="q-mt-sm"
                  v-for="p in products"
                  :key="p.link"
                  :link="p.link"
                  :desc="p.desc"
                />
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ProductItem from "src/components/ProductItem.vue";
import { ref } from "vue";

defineOptions({
  name: "MainLayout",
});

const keyword = ref("");
const products = ref([
  {
    desc: "Avidlove Lingerie for Women Lace Corset and Panty Outfits Garter Lingerie Sets S-XXL",
    link: "https://m.media-amazon.com/images/I/71Gi2kz4MQL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    desc: "Women's Sexy Lace Lingerie Set with Garter Belt Bodysuit Teddy and Panty",
    link: "https://m.media-amazon.com/images/I/71W41oCRhEL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    desc: "Avidlove Lingerie Set for Women Sexy Lace Two Piece Lingerie Outfits with Tie Top and Mini Pleated Skirt Set",
    link: "https://m.media-amazon.com/images/I/81NSaKV5NIL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    desc: "Women's Sexy Lingerie 3 Piece Lingerie Set with Garter Belt Stockings and Panty",
    link: "https://m.media-amazon.com/images/I/61Se3tROZqL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    desc: "Avidlove Lingerie for Women Lace Babydoll Sleepwear Boudoir Outfits Plus Size Langeray XS-5XL",
    link: "https://m.media-amazon.com/images/I/71CcRiu6vVL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    desc: "Lilosy Sexy Underwire Floral Lace Sheer Lingerie Set for Women See Through Bra and Panty 2 Piece",
    link: "https://m.media-amazon.com/images/I/712KXig5GyL._AC_UL640_FMwebp_QL65_.jpg",
  },
]);

const brandFilter = ref([
  {
    label: "Avidlove",
    value: false,
  },
  {
    label: "SOLY HUX",
    value: false,
  },
  {
    label: "WDIRARA",
    value: false,
  },
  {
    label: "Verdusa",
    value: false,
  },
  {
    label: "OYOANGLE",
    value: false,
  },
  {
    label: "Kaei&Shi",
    value: false,
  },
]);

const selectedBtn = ref("");
const scales = ref([
  { label: "XXS", value: "xxs" },
  { label: "XS ", value: "xs" },
  { label: " S ", value: "s" },
  { label: " M ", value: "m" },
  { label: " L ", value: "l" },
  { label: "XL ", value: "xl" },
  { label: "XXL ", value: "xxl" },
  { label: "3XL", value: "3xl" },
]);

const closures = ref([
  { label: "Buckle", value: false },
  { label: "Button", value: false },
  { label: "Double Ring", value: false },
  { label: "Drawstring", value: false },
  { label: "Hook & Eye", value: false },
  { label: "Hook & Loop", value: false },
  { label: "Pull On", value: false },
]);
</script>

<style scoped>
.searchInput {
  width: 500px;
}

.text-indent {
  text-indent: 1em;
}

.link-hover:hover {
  color: #cb2a45;
  cursor: pointer;
}
</style>
