<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="User" />
        <q-breadcrumbs-el label="Star" />
        <q-breadcrumbs-el label="Add" />
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md column items-center">
      <q-form class="q-gutter-lg" @submit="add" style="width: 50%">
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
import { onMounted, ref, watch } from "vue";
import { service } from "src/services/api";
import OSS from "ali-oss";
import { DateTime } from "luxon";
import { useQuasar } from "quasar";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";

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

watch(star.value.posterImg, (newValue) => {
  if (newValue.file) {
    posterImgUrl.value = URL.createObjectURL(newValue.file);
  } else if (newValue.url) {
    posterImgUrl.value = newValue.url;
  }
}),
  { deep: true };
watch(star.value.avatarImg, (newValue) => {
  if (newValue.file) {
    avatarImgUrl.value = URL.createObjectURL(newValue.file);
  } else if (newValue.url) {
    avatarImgUrl.value = newValue.url;
  }
}),
  { deep: true };
watch(star.value.coverImg, (newValue) => {
  if (newValue.file) {
    coverImgUrl.value = URL.createObjectURL(newValue.file);
  } else if (newValue.url) {
    coverImgUrl.value = newValue.url;
  }
}),
  { deep: true };

// const isPosterImgUploaded = ref(false);
// const isCoverImgUploaded = ref(false);
// const isAvatarImgUploaded = ref(false);
const loading = ref(false);
const token = ref({});
const ossClient = ref(null);

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
    await checkToken();
    await uploadFile();
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

async function uploadFile() {
  const files = [
    star.value.posterImg,
    star.value.avatarImg,
    star.value.coverImg,
  ];
  for (let i = 0; i < files.length; i++) {
    const uuid = uuidv4();
    const fileAppendex = files[i].file.name.split(".")[1];
    const res = await ossClient.value.put(
      `/files/img/${uuid}.${fileAppendex}`,
      files[i].file,
      { headers }
    );
    files[i].url = res.url;
  }
}

async function checkToken() {
  const tokenRaw = Cookies.get("token");
  if (tokenRaw === undefined) {
    const data = await getToken();
    token.value = data;
    Cookies.set("token", JSON.stringify(data));
  } else {
    token.value = JSON.parse(tokenRaw);
    console.log(token.value);

    const tokenExpirationTime = DateTime.fromISO(
      token.value.expiration
    ).toUTC();
    const timeNow = DateTime.now().toUTC();
    const timeDiff = timeNow.diff(tokenExpirationTime, "minutes").minutes;

    if (timeDiff > 0) {
      token.value = await getToken();
      Cookies.set("token", JSON.stringify(token.value));
    }
  }
  ossClient.value = new OSS({
    bucket: "mikasa97",
    region: "oss-us-east-1",
    accessKeyId: token.value.access_key_id,
    accessKeySecret: token.value.access_key_secret,
    stsToken: token.value.security_token,
  });
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
const headers = {
  // 指定Object的存储类型。
  "x-oss-storage-class": "Standard",
  // 设置Object的标签，可同时设置多个标签。
  // "x-oss-tagging": "Tag1=1&Tag2=2",
  // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
  "x-oss-forbid-overwrite": "true",
};

async function getToken() {
  try {
    const response = await service.getOssToken({});
    return response.data.data;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "Get Token failed",
    });
  }
}

onMounted(() => {
  if (props.starId) {
    console.log("onload");

    onLoadStar();
  }
});
</script>
