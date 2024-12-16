<template>
  <q-page>
    <div class="row q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="User" />
        <q-breadcrumbs-el label="Management" />
        <q-breadcrumbs-el label="Star" />
        <q-breadcrumbs-el label="Products" />
      </q-breadcrumbs>
      <q-space />
      <q-btn
        label="Add Product"
        flat
        color="primary"
        @click="
          router.push({
            name: 'UserManageProductAdd',
            params: { starId: props.starId },
          })
        "
      />
    </div>

    <div>
      <q-list separator padding class="q-px-md">
        <q-item>
          <q-item-section class="col-1"></q-item-section>
          <q-item-section class="col-3">Description</q-item-section>
          <q-item-section class="col-2">Price</q-item-section>
          <q-item-section class="col">Sold</q-item-section>
          <q-space />
          <q-item-section class="col-2"></q-item-section>
        </q-item>
        <q-item v-for="s in products" :key="s.id">
          <q-item-section class="col-1">
            <q-img
              :src="s.cover_url"
              :fit="contain"
              style="max-height: 100px"
            />
          </q-item-section>
          <q-item-section class="col-3">
            {{ s.description }}
          </q-item-section>
          <q-item-section class="col-2">
            {{ tool.getUnit(s.unit) }}{{ s.price }}
          </q-item-section>
          <q-item-section class="col">
            {{ s.sold }}
          </q-item-section>
          <q-item-section class="col-2">
            <q-btn
              label="Modify"
              color="primary"
              dense
              @click="
                router.push({
                  name: 'UserManageProductUpdate',
                  params: { starId: props.starId, productId: s.id },
                })
              "
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { service } from "src/services/api";
import { tool } from "src/uril/tool";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  starId: {
    type: String,
    required: true,
  },
});

const products = ref([]);
const total = ref(0);
const loading = ref(false);
const currentPage = ref(1);
const size = 20;
const $q = useQuasar();
const router = useRouter();

async function onLoad() {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const body = {
      page: currentPage.value,
      size: size,
    };
    const response = await service.getProductsByOrg(props.starId, body);
    const data = response.data.data;
    products.value = data.products;
    total.value = data.total;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "Failed to get products",
      position: "top",
    });
  }

  loading.value = false;
}

onMounted(() => {
  onLoad();
});
</script>
