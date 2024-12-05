<template>
  <q-input
    v-model="phoneNumber"
    color="white"
    type="text"
    placeholder="Phone number"
    @keydown="restrictKeyInput"
    @update:model-value="updatePhoneNumber"
  >
    <template v-slot:prepend>
      <div class="row">
        <span style="font-size: 16px">
          {{ countryCode }} {{ countryDailCode }}
        </span>
        <q-menu>
          <q-list style="max-width: 100px">
            <q-item
              v-for="c in countryCodeDialMap"
              :key="c.countryCode"
              clickable
              v-close-popup
              @click="changeCountryCode(c)"
            >
              <q-item-section>
                {{ c.countryCode }} {{ c.dailCode }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
        <q-separator />
      </div>
    </template>
  </q-input>
</template>

<script setup>
import { countryCodeDialMap } from "src/uril/tool";
import { ref } from "vue";

const emit = defineEmits(["update:model-value"]);
const props = defineProps({
  countryCode: {
    type: String,
    required: true,
  },
  countryDailCode: {
    type: String,
    required: true,
  },
});

const phoneNumber = ref("");
const countryCode = ref(props.countryCode);
const countryDailCode = ref(props.countryDailCode);

function changeCountryCode(c) {
  countryCode.value = c.countryCode;
  countryDailCode.value = c.dailCode;
  updatePhoneNumber();
}

function updatePhoneNumber() {
  emit("update:model-value", `(${countryDailCode.value})${phoneNumber.value}`);
}

function restrictKeyInput(event) {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
  const isNumberKey = /^[0-9]$/.test(event.key);

  if (!isNumberKey && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
}
</script>

<style scoped></style>
