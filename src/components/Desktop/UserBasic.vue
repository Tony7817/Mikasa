<template>
  <!--Email-->
  <UserBasicItem
    v-if="user.email !== null"
    v-model="user.email"
    label="Email"
    icon="email"
  />
  <UserBasicItem
    v-else
    v-model="user.phonenumber"
    label="phonenumber"
    icon="phone_iphone"
  />

  <!-- Username -->
  <UserBasicItem v-model="user.username" label="username" icon="person" />
</template>

<script setup>
import { useQuasar } from "quasar";
import { service } from "src/services/api";
import { onMounted, ref } from "vue";
import UserBasicItem from "./UserBasicItem.vue";
import _ from "lodash";

const onloading = ref(false);
const $q = useQuasar();
const user = ref({
  email: "",
  phonenumber: "",
  username: "",
});
const isEmailEdited = ref(false);
const isPhoneNumberEdit = ref(false);
const isUserNameEdit = ref(false);
const phonePrefix = ref("");
const phoneNumber = ref("");

function setPhonenumberandprefix() {
  const res = user.value.phonenumber.split(")");
  phoneNumber.value = res[1];
  _.trimStart()
  phonePrefix.value = res[0];
}

async function onLoad() {
  if (onloading.value) {
    return;
  }

  onloading.value = true;

  try {
    const response = await service.getUserDetail();
    const data = response.data.data;
    user.value.email = data.email;
    user.value.phonenumber = data.phonenumber;
    user.value.username = data.username;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error.response?.data?.message || "Something went wrong",
      position: "top",
    });
  }

  onloading.value = false;
}

onMounted(() => {
  onLoad();
});
</script>

<style scoped></style>
