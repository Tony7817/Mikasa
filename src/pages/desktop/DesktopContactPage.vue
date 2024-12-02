<template>
  <q-page>
    <q-img
      src="https://s1.locimg.com/2024/12/02/1afbe1b2f55e3.png"
      fit="cover"
      style="height: 50vh"
    >
      <div class="absolute-full text-bold flex flex-center text-h4">
        Contact us to get your store
      </div>
    </q-img>
    <div class="row">
      <div class="col">
        <div class="text-center text-h5 q-my-lg">Leave your contact</div>
        <div class="row justify-center">
          <q-form class="q-gutter-md" style="width: 40%">
            <q-input
              v-model="contactName"
              label="Name"
              filled
              dense
              outlined
              color="primary"
              required
            />
            <q-input
              v-model="contactEmail"
              label="Email"
              filled
              dense
              outlined
              color="primary"
              required
            />
            <q-input
              v-model="contactPlatForm"
              label="Which platform are you on?"
              filled
              dense
              outlined
              color="primary"
              required
            />
            <q-input
              v-model="contactUserName"
              label="your username used on the platform"
              filled
              dense
              outlined
              color="primary"
              required
            />
            <div class="row justify-center">
              <q-btn label="submit" color="primary" outline />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { setup } from "src/composables/contact";

const { contactName, contactEmail, contactUserName, contactPlatForm } = setup;
</script>

<style lang="scss" scoped></style>
