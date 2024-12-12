<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="User" />
        <q-breadcrumbs-el label="Management" />
        <q-breadcrumbs-el label="Star" />
        <q-breadcrumbs-el label="Add" />
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md column items-center">
      <q-form class="q-gutter-lg" @submit="submit" style="width: 50%">
        <div class="row items-center q-gutter-md">
          <div class="col-2">Star Name</div>
          <q-input class="col" v-model="star.name" outlined dense />
        </div>
        <div class="row items-center q-gutter-md">
          <div class="col-2" style="margin-bottom: 22px">Poster Image</div>
          <q-file
            class="col"
            dense
            hint="200kb max"
            accept=".jpg,image/*"
            v-model="star.posterImg.file"
            filled
            max-file-size="204800"
            counter
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <q-img
            v-if="posterImgUrl"
            :src="posterImgUrl"
            fit="contain"
            style="max-height: 200px"
          />
        </div>

        <div class="row items-center q-gutter-md">
          <div class="col-2" style="margin-bottom: 22px">Avatar Image</div>
          <q-file
            class="col"
            dense
            v-model="star.avatarImg.file"
            hint="50kb max"
            accept="image/*"
            filled
            max-file-size="20480"
            counter
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <q-img
            v-if="avatarImgUrl"
            :src="avatarImgUrl"
            fit="contain"
            style="max-height: 100px"
          />
        </div>
        <div class="row items-center q-gutter-md">
          <div class="col-2" style="margin-bottom: 22px">Cover Image</div>
          <q-file
            class="col"
            dense
            v-model="star.coverImg.file"
            hint="100kb max"
            accept="image/*"
            filled
            max-file-size="104800"
            counter
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          <q-img
            v-if="coverImgUrl"
            :src="coverImgUrl"
            fit="contain"
            style="max-height: 200px"
          />
        </div>
        <div class="row items-center q-gutter-md">
          <div class="col-2">Description</div>
          <q-input
            class="col"
            v-model="star.description"
            outlined
            type="textarea"
          />
        </div>
        <div class="row justify-center">
          <q-btn label="Add" type="submit" color="primary" :loading="loading" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { service } from "src/services/api";
import { useQuasar } from "quasar";
import { cloneDeep } from "lodash";
import { uploadFiles } from "src/uril/tool";

const $q = useQuasar();
const props = defineProps({
  starId: {
    type: String,
    require: false,
    default: "",
  },
});

const ImgObj = {
  file: null,
  url: "",
  name: "",
};
const posterImgUrl = ref("");
const coverImgUrl = ref("");
const avatarImgUrl = ref("");

const star = ref({
  id: "",
  name: "",
  posterImg: cloneDeep(ImgObj),
  coverImg: cloneDeep(ImgObj),
  avatarImg: cloneDeep(ImgObj),
  description: "",
});

watch(
  star.value.posterImg,
  (newValue) => {
    if (newValue.file) {
      posterImgUrl.value = URL.createObjectURL(newValue.file);
    } else if (newValue.url) {
      posterImgUrl.value = newValue.url;
    }
  },
  { deep: true }
);
watch(
  star.value.avatarImg,
  (newValue) => {
    if (newValue.file) {
      avatarImgUrl.value = URL.createObjectURL(newValue.file);
    } else if (newValue.url) {
      avatarImgUrl.value = newValue.url;
    }
  },
  { deep: true }
);
watch(
  star.value.coverImg,
  (newValue) => {
    if (newValue.file) {
      coverImgUrl.value = URL.createObjectURL(newValue.file);
    } else if (newValue.url) {
      coverImgUrl.value = newValue.url;
    }
  },
  { deep: true }
);

const loading = ref(false);

const hasFileUpload = computed(() => {
  return (
    star.value.posterImg.file !== null ||
    star.value.coverImg.file !== null ||
    star.value.avatarImg.file !== null
  );
});

async function update() {
  if (loading.value) {
    return;
  }

  loading.value = true;

  // TODO: delete files if changed.

  if (hasFileUpload.value) {
    await uploadFiles([
      star.value.posterImg,
      star.value.coverImg,
      star.value.avatarImg,
    ]);
  }

  try {
    const body = {
      id: props.starId,
      name: star.value.name || null,
      poster_url: star.value.posterImg.url || null,
      cover_url: star.value.coverImg.url || null,
      avatar_url: star.value.avatarImg.url || null,
      description: star.value.description || null,
    };
    const response = await service.updateStar(props.starId, body);
    const data = response.data.data;
    if (data.status === "ok") {
      $q.notify({
        type: "positive",
        message: "success",
        position: "top",
      });
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "something went wrong",
      position: "top",
    });
  }

  loading.value = false;
}

function submit() {
  if (props.starId) {
    update();
  } else {
    add();
  }
}

function validate() {
  if (
    star.value.posterImg === null ||
    star.value.name === "" ||
    star.value.coverImg === null ||
    star.value.avatarImg === null
  ) {
    return false;
  }
  return true;
}

async function add() {
  if (loading.value) {
    return;
  }
  loading.value = true;

  if (!validate()) {
    $q.notify({
      type: "negative",
      message: "Please fill all the information",
      position: "top",
    });
    loading.value = false;
    return;
  }

  try {
    await uploadFiles([
      star.value.posterImg,
      star.value.coverImg,
      star.value.avatarImg,
    ]);
    await service.createStar({
      name: star.value.name,
      description: star.value.description,
      avatar_url: star.value.avatarImg.url,
      image_url: star.value.coverImg.url,
      poster_url: star.value.posterImg.url,
    });
    $q.notify({
      type: "positive",
      message: "success",
      position: "top",
    });
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "something went wrong",
      position: "top",
    });
  }

  loading.value = false;
}

function getFiles() {
  // add
  const files = [];
  if (star.value.posterImg.file !== null) {
    files.push(star.value.posterImg.file);
  }
  if (star.value.coverImg.file !== null) {
    files.push(star.value.coverImg.file);
  }
  if (star.value.avatarImg.file !== null) {
    files.push(star.value.avatarImg.file);
  }

  return files;
}

async function onLoadStar() {
  if (loading.value) {
    return;
  }
  loading.value = true;

  try {
    const response = await service.getStarDetail(props.starId);
    const data = response.data.data;
    star.value.id = data.id;
    star.value.name = data.name;
    star.value.posterImg.url = data.poster_url;
    star.value.coverImg.url = data.cover_url;
    star.value.avatarImg.url = data.avatar_url;
    star.value.description = data.description;
  } catch (error) {
    console.log(error);

    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "something went wrong",
      position: "top",
    });
  }

  loading.value = false;
}

// 自定义请求头

onMounted(() => {
  if (props.starId) {
    onLoadStar();
  }
});
</script>
