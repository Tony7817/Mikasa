<template>
  <q-page>
    <div class="row q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="User" />
        <q-breadcrumbs-el label="Star Management" />
      </q-breadcrumbs>
      <q-space />
      <q-btn
        label="Add Star"
        flat
        color="primary"
        :to="{ name: 'UserManageStarAdd' }"
      />
    </div>

    <div>
      <q-list separator padding class="q-px-md">
        <q-item>
          <q-item-section class="col-1"></q-item-section>
          <q-item-section class="col-3">Name</q-item-section>
          <q-item-section class="col">Product Number</q-item-section>
        </q-item>
        <q-item v-for="s in stars" :key="s.id">
          <q-item-section class="col-1">
            <q-avatar>
              <q-img :src="s.avatar_url" />
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-3">
            {{ s.name }}
          </q-item-section>
          <q-item-section>
            {{ s.product_count }}
          </q-item-section>
          <q-space />
          <q-item-section class="col-1">
            <q-btn
              label="Modify"
              color="primary"
              @click="
                router.push({
                  name: 'UserManageStarDetail',
                  params: { starId: s.id },
                })
              "
            />
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn
              label="Products"
              color="primary"
              @click="
                router.push({
                  name: 'UserManageProduct',
                  params: { starId: s.id },
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();

const loading = ref(false);
const currentPage = ref(1);
const pageSize = 20;
const stars = ref([]);
const totalCount = ref(0);

async function onLoad() {
  if (loading.value) {
    return;
  }

  loading.value = true;
  const body = {
    page: currentPage.value,
    page_size: pageSize,
  };

  try {
    const response = await service.getManageStarList(body);
    const data = response.data.data;
    stars.value = data.stars;
    totalCount.value = data.total;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "Something went wrong",
      position: "top",
    });
  }

  loading.value = false;
}

onMounted(() => {
  onLoad();
});
</script>

<style lang="scss" scoped></style>
