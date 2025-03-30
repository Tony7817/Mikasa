<template>
  <div>
    <q-page padding>
      <div>
        <div class="row items-center">
          <div class="text-center q-mt-lg text-h4">We are working on it for now</div>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { service } from "src/services/api";
import { onMounted } from "vue";
import { ref } from "vue";

const loading = ref(false);
const $q = useQuasar();
const user = ref();

async function onLoadUserInfo() {
  if (loading.value) return;
  loading.value = true;

  try {
    const response = service.getUserDetail({});
    user.value = response.data;
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      position: "top",
      message: error?.response?.data?.msg || "something went wrong",
    });
  }

  loading.value = false;
}

onMounted(() => {
  onLoadUserInfo();
});
</script>

<style lang="scss" scoped></style>
