<template>
  <div class="row items-center" style="padding: 23px 16px 16px 16px">
    <div class="col-2">
      <q-chip
        square
        color="primary"
        :icon="icon"
        style="margin-bottom: -9px; width: 110px"
      >
        <span>{{ label }}</span>
      </q-chip>
    </div>
    <div class="col column">
      <div>
        <div class="row items-center q-gutter-md q-ml-sm">
          <div class="col-6">
            <q-input
              v-model="model"
              dense
              :disable="!isEditing"
              style="font-size: 16px"
            >
            </q-input>
          </div>
          <q-btn
            v-if="!isEditing"
            icon="border_color"
            color="primary"
            outline
            flat
            dense
            style="margin-bottom: -23px; font-size: 10px"
            @click="toggleEditing"
          />
          <q-btn
            v-if="isEditing"
            icon="check"
            color="primary"
            outline
            flat
            dense
            style="margin-bottom: -11px; font-size: 10px"
            @click="save"
          />
        </div>
      </div>
    </div>
    <div class="col-4"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "save"]);
const model = defineModel();

const isEditing = ref(false);

function toggleEditing() {
  isEditing.value = true;
}

function save() {
  isEditing.value = false;
}
</script>

<style scoped></style>
