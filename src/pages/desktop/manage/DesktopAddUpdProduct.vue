<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="User" />
        <q-breadcrumbs-el label="Management" />
        <q-breadcrumbs-el label="Star" />
        <q-breadcrumbs-el label="Product" />
        <q-breadcrumbs-el label="Add" />
      </q-breadcrumbs>
    </div>
    <q-form @submit="submit">
      <div class="row q-pa-md q-gutter-lg">
        <div class="col-5">
          <div v-for="f in imgfiles" :key="f.url">
            <q-file
              class="q-mt-md"
              v-model="f.file"
              accept=".jpg,image/*"
              filled
              max-file-size="204800"
            >
              <template v-slot:append>
                <q-btn icon="close" flat dense @click="cancelFle(f)" />
              </template>
            </q-file>
          </div>
          <div class="row q-gutter-md">
            <div v-for="f in imgfiles" :key="f.url">
              <q-img
                v-if="f.url"
                :src="f.url"
                fit="cover"
                style="width: 404px; height: 524px"
              />
            </div>
          </div>
        </div>
        <div class="col column q-gutter-md">
          <q-input label="name" v-model="product.name" dense />
          <q-input label="description" v-model="product.description" dense />
          <q-input label="color" v-model="selectedColor.color" dense />
          <q-input label="size" v-model="product.size" dense />
          <div class="row">
            <q-input
              label="price"
              class="col-8"
              v-model="product.price"
              type="number"
              dense
            />
            <q-input
              label="unit"
              class="col q-ml-md"
              v-model="product.unit"
              dense
            />
          </div>
          <q-input
            label="in stock"
            v-model="product.in_stock"
            type="number"
            dense
          />
          <q-input
            label="detail"
            v-model="product.detail"
            type="textarea"
            dense
          />
        </div>
      </div>
      <q-separator class="q-ma-md" />
      <div class="text-center text-h5">Picture</div>
      <div class="column q-px-lg">
        <div v-for="file in PictureFiles" :key="file.url">
          <q-file
            class="q-mt-md"
            v-model="file.file"
            accept=".jpg,image/*"
            filled
            max-file-size="409600"
          >
            <template v-slot:append>
              <q-btn icon="close" flat dense @click="cancelFle(file)" />
            </template>
          </q-file>
          <q-img
            v-if="file.url !== ''"
            :src="file.url"
            fit="contain"
            height="500px"
          />
        </div>
      </div>

      <div class="row justify-center q-my-lg">
        <q-btn
          label="submit"
          color="primary"
          type="submit"
          :loading="loading"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { cloneDeep } from "lodash";
import { useQuasar } from "quasar";
import { uploadFiles } from "src/uril/tool";
import { ref, computed, watch, onMounted } from "vue";
import _ from "lodash";
import { service } from "src/services/api";

const $q = useQuasar();
const props = defineProps({
  starId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: false,
    default: "",
  },
});

const imgObj = {
  file: null,
  url: "",
  name: "",
};

const selectedColor = ref({});
const product = ref({
  id: "",
  name: "",
  description: "",
  color: "",
  size: "",
  price: "",
  unit: "",
  in_stock: 0,
  detail: "",
});

const imgfiles = ref([
  cloneDeep(imgObj),
  cloneDeep(imgObj),
  cloneDeep(imgObj),
  cloneDeep(imgObj),
  cloneDeep(imgObj),
]);

// new
const oldImgFiles = ref([
  cloneDeep(imgObj),
  cloneDeep(imgObj),
  cloneDeep(imgObj),
  cloneDeep(imgObj),
  cloneDeep(imgObj),
]);

imgfiles.value.forEach((file, index) => {
  watch(
    () => file.file,
    (newVal) => {
      imgfiles.value[index].url = URL.createObjectURL(newVal);
    },
    { deep: true }
  );
});

function cancelFle(f) {
  f.file = null;
  f.url = "";
}

const PictureFiles = ref([
  cloneDeep(imgObj),
  cloneDeep(imgObj),
  cloneDeep(imgObj),
  cloneDeep(imgObj),
]);

const OldPictureFiles = ref([
  cloneDeep(imgObj),
  cloneDeep(imgObj),
  cloneDeep(imgObj),
  cloneDeep(imgObj),
]);

const loading = ref(false);

function validate() {
  if (
    product.value.name === "" ||
    product.value.color === "" ||
    product.value.size === "" ||
    product.value.price === 0 ||
    product.value.unit === ""
  ) {
    $q.notify({
      type: "negative",
      message: "please fill product's information",
      position: "top",
    });
    return false;
  }

  return true;
}

async function submit() {
  if (props.productId !== "") {
    await update();
  } else {
    // upload file
    await create();
  }
}

async function onLoad() {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const response = await service.getProductDetailByOrg(
      props.productId,
      props.productId
    );
    const data = response.data.data;
    _.assign(product.value, data);
    selectedColor.value = product.value.color[0];
    product.value.color[0].images.forEach((c, index) => {
      imgfiles.value[index].url = c.url;
      oldImgFiles.value[index].url = c.url;
    });
    product.value.color[0].model_images.forEach((c, index) => {
      PictureFiles.value[index].url = c.url;
      OldPictureFiles.value[index].url = c.url;
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "Something went wrong",
      position: "top",
    });
  }

  loading.value = false;
}

async function create() {
  if (loading.value) {
    return;
  }

  loading.value = true;

  if (!validate()) {
    loading.value = false;
    return;
  }

  try {
    await uploadFiles(imgfiles.value);
    await uploadFiles(PictureFiles.value);

    const body = {};
    _.assign(body, product.value);
    body.price = parseFloat(body.price);
    body.images = [];
    imgfiles.value.forEach((i) => {
      if (i.url !== "") {
        body.images.push(i.url);
      }
    });
    if (body.images.length === 0) {
      $q.notify({
        type: "negative",
        message: "please upload product's image",
        position: "top",
      });
      loading.value = false;
      return;
    }
    body.model_imgs = [];
    PictureFiles.value.forEach((i) => {
      if (i.url !== "") {
        body.model_imgs.push(i.url);
      }
    });
    body.in_stock = parseInt(body.in_stock);
    await service.createProduct(props.starId, body);
    $q.notify({
      type: "positive",
      message: "Product created successfully",
      position: "top",
    });
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "Something went wrong",
    });
  }

  loading.value = false;
}

async function update() {
  if (loading.value) {
    return;
  }

  loading.value = true;
  if (!validate()) {
    loading.value = false;
    return;
  }

  var imgMap = {};
  var picMap = {};
  oldImgFiles.value.forEach((i, index) => {
    imgMap[i.url] = i;
  });
  OldPictureFiles.value.forEach((i) => {
    picMap[i.url] = i;
  });

  imgfiles.value.forEach((i, index) => {
    if (imgMap[i.url] !== undefined) {
      imgfiles.value[index].file = null;
    }
  });
  PictureFiles.value.forEach((i, index) => {
    if (picMap[i.url] !== undefined) {
      PictureFiles.value[index].file = null;
    }
  });

  var uploadImgFiles = [];
  imgfiles.value.forEach((i) => {
    if (i.file !== null) {
      uploadFiles.push(i);
    }
  });
  var uploadPicFiles = [];
  PictureFiles.value.forEach((i) => {
    if (i.file !== null) {
      uploadPicFiles.push(i);
    }
  });

  try {
    if (uploadImgFiles.length > 0) {
      await uploadFiles(uploadImgFiles);
    }
    if (uploadPicFiles.length > 0) {
      await uploadFiles(uploadPicFiles);
    }
    const body = {};
  } catch (error) {}

  loading.value = false;
}

onMounted(() => {
  if (props.productId !== "") {
    onLoad();
  }
});
</script>
