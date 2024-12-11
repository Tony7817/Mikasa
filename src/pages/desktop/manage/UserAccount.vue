<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="User" />
        <q-breadcrumbs-el label="Account" />
      </q-breadcrumbs>
    </div>
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

    <!-- Password -->
    <div class="row items-center" style="padding: 23px 16px 16px 16px">
      <div class="col-2">
        <q-chip
          square
          color="primary"
          icon="loc"
          style="margin-bottom: -9px; width: 110px"
        >
          <span>Password</span>
        </q-chip>
      </div>
      <div class="col column">
        <div>
          <div class="row items-center q-gutter-md q-ml-sm">
            <div class="col-6">
              <q-input
                v-model="passwordMark"
                dense
                :disable="true"
                style="font-size: 16px"
              >
              </q-input>
            </div>
            <q-btn
              icon="border_color"
              color="primary"
              outline
              flat
              dense
              style="margin-bottom: -23px; font-size: 10px"
              @click="changePasswordDialogShow = true"
            />
          </div>
        </div>
      </div>
      <div class="col-4"></div>
    </div>
    <q-dialog v-model="changePasswordDialogShow" persistent>
      <q-card class="bg-grey-10" style="width: 500px">
        <q-card-section>
          <div class="row items-center">
            <q-btn
              class="col-1"
              icon="arrow_back"
              color="primary"
              flat
              @click="changePasswordDialogShow = false"
            />
            <div class="col text-center text-h6 text-bold">
              Reset your password
            </div>
            <div class="col-1"></div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-center q-gutter-md items-center">
            <div style="font-size: 16px">Your old password:</div>
            <q-input class="col-7" v-model="password" dense />
          </div>
          <div class="row justify-center q-mt-md">
            <q-btn label="Continue" color="primary" />
          </div>
          <div class="text-center text-primary q-mt-md">forget password?</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { service } from "src/services/api";
import { onMounted, ref } from "vue";
import UserBasicItem from "src/components/Desktop/UserAccountField.vue";
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
const passwordMark = ref("********");
const password = ref("");
const changePasswordDialogShow = ref(false);

function setPhonenumberandprefix() {
  const res = user.value.phonenumber.split(")");
  phoneNumber.value = res[1];
  _.trimStart();
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
