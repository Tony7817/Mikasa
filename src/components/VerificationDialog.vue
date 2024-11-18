<template>
  <q-dialog persistent :model-value="props.show">
    <q-card style="width: 500px">
      <q-card-section>
        <div class="row">
          <q-btn flat dense icon="arrow_back" @click="close" />
        </div>
        <div class="text-center text-h5 text-bold q-mb-sm">
          Enter the verification code
        </div>
        <div class="text-center text-h6 q-mb-md">
          A verification code is sent to
          <span class="text-primary">
            {{ props.target }}
          </span>
        </div>
        <div class="row q-gutter-md no-wrap q-mb-md">
          <q-input
            v-for="(code, index) in verifyCode"
            :key="index"
            :autofocus="index === 0 ? true : false"
            :ref="setInputRef(index)"
            class="col-2"
            v-model="verifyCode[index]"
            @keydown="handleKeydown(index, $event)"
            maxlength="1"
            debounce="300"
            outlined
            style="width: 65px"
            type="text"
          />
        </div>
        <div v-if="isIncorrectShown" class="text-center text-red">
          incorrect verification code.
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { Email } from "src/composables/consts";
import { service } from "src/services/api";
import { computed, onMounted, ref, watch } from "vue";
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    require: true,
  },
  countryDialCode: {
    type: String,
    require: true,
  },
  loading: {
    type: Boolean,
    require: true,
  },
});

function close() {
  verifyCode.value = ["", "", "", "", "", ""];
  emit("disable-dialog");
}

const verifyCode = ref(["", "", "", "", "", ""]);
const verifyLoading = ref(false);

// 输入框 refs 存储
const inputRefs = ref([]);
const isIncorrectShown = ref(false);
const $q = useQuasar();
const emit = defineEmits(["disable-dialog", "signup"]);

watch(
  verifyCode,
  async (newCode) => {
    // 检查是否所有输入框都已填满
    if (newCode.every((val) => val.length === 1)) {
      await verfiyCode();
    }
  },
  { deep: true }
);

async function verfiyCode() {
  if (verifyLoading.value) {
    return;
  }
  verifyLoading.value = true;

  try {
    const body = { captcha: verifyCode.value.join("") };
    if (props.mode === Email) {
      body.email = props.target;
    } else {
      body.phone_number = props.target;
    }
    const resposne = await service.verifyCaptcha(body);
    const data = resposne.data.data;
    if (data.ok) {
      isIncorrectShown.value = false;
      close();
      emit("signup");
    } else {
      isIncorrectShown.value = true;
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "error",
      position: "top",
    });
  }

  verifyLoading.value = false;
}

// 动态设置 ref
function setInputRef(index) {
  return (el) => {
    inputRefs.value[index] = el;
  };
}

// 限制输入的逻辑
function handleKeydown(index, event) {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
  const isNumberKey = /^[0-9]$/.test(event.key);

  // 限制非数字和非功能键输入
  if (!allowedKeys.includes(event.key) && !isNumberKey) {
    event.preventDefault();
    return;
  }

  // 处理 Backspace 键
  if (event.key === "Backspace" && verifyCode.value[index] === "") {
    if (index > 0) {
      inputRefs.value[index - 1].focus();
    }
    return;
  }

  // 自动跳转到下一个输入框
  if (isNumberKey) {
    verifyCode.value[index] = event.key;
    if (index < verifyCode.value.length - 1) {
      inputRefs.value[index + 1].focus();
    }
    event.preventDefault();
  }
}
</script>

<style lang="css" scoped></style>
