import { ref } from "vue";
import { service } from "src/services/api";
import { merge } from "src/uril/tool";
import { useQuasar } from "quasar";

export function setup() {
  const products = ref({
    total: 0,
    products: [],
  });
  const loading = ref(false);
  const currentPage = ref(1);
  const $q = useQuasar();

  async function onLoad() {
    if (loading.value) {
      return true;
    }

    loading.value = true;

    try {
      const response = await service.getProductList({
        page: currentPage.value,
        size: 20,
      });
      const data = response.data.data;
      merge(products.value, data);
    } catch (error) {
      $q.notify({
        type: "negative",
        message: "something went wrong",
        position: "top",
      });
    }

    loading.value = false;
  }

  return {
    products,
    onLoad,
  };
}
