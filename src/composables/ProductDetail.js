import { useQuasar } from "quasar";
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { service } from "src/services/api";
import { useUserStore } from "src/stores/user";

export function setup() {
  const $q = useQuasar();
  const route = useRoute();
  const router = useRouter();

  const selectedSize = ref("");
  const productId = route.params.productId;
  const selectedColor = ref({});
  const selectedImage = ref("");
  const loadingAddCart = ref(false);
  const userStore = useUserStore();
  const product = ref({
    id: "",
    price: 0,
    unit: "",
    colors_url: [],
    description: "",
    size: [],
    colors: [],
    rating: 0,
    default_color: {
      color: "",
      images: [],
    },
    rate_count: 0,
    sold_num: 0,
  });

  const rating = computed(() => {
    return product.value.rate ? product.value.rate : 0;
  });

  async function onLoadProduct() {
    try {
      const response = await service.getProductDetail(productId, {});
      product.value = response.data.data;
      selectedColor.value = product.value.colors[0];
      selectedImage.value = product.value.colors[0].images[0];
    } catch (error) {
      console.log(error);
      $q.notify({
        type: "negative",
        message: "Something went wrong",
        position: "top",
      });
    }
  }

  async function addToCart() {
    if (loadingAddCart.value) {
      return;
    }
    if (!selectedSize.value) {
      $q.notify({
        type: "negative",
        message: "Please select your size",
        position: "top",
      });
      return;
    }

    loadingAddCart.value = true;

    try {
      const response = await service.addProductToCart(product.value.id, {
        size: selectedSize.value,
      });
      const status = response.data.code;
      if (status === 200) {
        $q.notify({
          type: "positive",
          message: "success",
          position: "top",
        });
      }
    } catch (error) {
      console.log(error);
      $q.notify({
        type: "negative",
        message: "Something went wrong",
        position: "top",
      });
    }

    loadingAddCart.value = false;
  }

  return {
    selectedSize,
    selectedImage,
    selectedColor,
    loadingAddCart,
    product,
    rating,
    userStore,
    router,
    $q,
    onLoadProduct,
    addToCart,
  };
}
