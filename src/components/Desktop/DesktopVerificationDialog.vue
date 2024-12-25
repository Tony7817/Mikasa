<template>
  <q-dialog persistent :model-value="props.show">
    <q-card class="bg-grey-10" style="width: 500px">
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
        <div class="row justify-center">
          <q-btn
            :label="resetPrompt"
            :disable="isButtonDisabled"
            no-caps=""
            outline
            color="primary"
            @click="resend"
            :loading="resendLoading"
          >
          </q-btn>
        </div>
        <div class="row justify-center q-mt-md">
          <q-spinner v-if="verifyLoading" size="3em" color="primary" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { Email, ForgetPasswordMode, SignupMode } from "src/composables/consts";
import { service } from "src/services/api";
import { computed, createApp, onMounted, ref, watch } from "vue";
import { DateTime } from "luxon";
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  // email of phonenumber
  mode: {
    type: String,
    required: true,
  },
  // value of email or phonenumber
  target: {
    type: String,
    require: true,
  },
  captchaTime: {
    type: Number,
    require: true,
  },
  // register or forgetpassword
  usage: {
    type: String,
    require: true,
  },
});

const remainingTime = ref(0);
const isButtonDisabled = ref(false);
const countdownInterval = ref(null);
const resendLoading = ref(false);
const captchaTimeLeft = computed(() => props.captchaTime);

const resetPrompt = computed(() => {
  return remainingTime.value > 0
    ? `Resend in ${remainingTime.value}s`
    : "Resend";
});

function startCountdown(createdAt) {
  const cooldownPeriod = 60; // 冷却时间（秒）

  const currentUtcTimestamp = Math.floor(Date.now() / 1000);
  const differenceInSeconds = Math.abs(currentUtcTimestamp - createdAt);
  const leftSeconds = Math.floor(cooldownPeriod - differenceInSeconds);

  // 设置剩余时间和禁用按钮
  remainingTime.value = leftSeconds;
  isButtonDisabled.value = leftSeconds > 0;

  // 清除现有定时器（如果存在）
  if (countdownInterval.value) clearInterval(countdownInterval.value);

  // 启动定时器
  if (remainingTime.value > 0) {
    countdownInterval.value = setInterval(() => {
      if (remainingTime.value > 0) {
        remainingTime.value -= 1;
      } else {
        clearInterval(countdownInterval.value);
        isButtonDisabled.value = false; // 重新启用按钮
      }
    }, 1000);
  }
}

function close() {
  verifyCode.value = [...["", "", "", "", "", ""]];
  emit("disable-dialog");
}

const verifyCode = ref(["", "", "", "", "", ""]);
const verifyLoading = ref(false);

// 输入框 refs 存储
const inputRefs = ref([]);
const isIncorrectShown = ref(false);
const $q = useQuasar();
const emit = defineEmits(["disable-dialog", "callback"]);

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
    var response = {};
    if (props.usage === ForgetPasswordMode) {
      response = await service.verifyAccountCaptcha(body);
    } else {
      response = await service.verifyCaptcha(body);
    }
    const data = response.data.data;
    if (data.ok) {
      isIncorrectShown.value = false;
      close();
      emit("callback");
    } else {
      isIncorrectShown.value = true;
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "something went wrong",
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

watch(captchaTimeLeft, (newValue) => {
  if (newValue !== 0) {
    startCountdown(captchaTimeLeft.value);
  }
});

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

async function resend() {
  if (resendLoading.value) {
    return;
  }

  resendLoading.value = true;

  try {
    var body = {
      now_time: DateTime.utc().toSeconds(),
    };
    if (props.mode === Email) {
      body.email = props.target;
    } else {
      body.phone_number = props.target;
    }
    var response = {};
    if (props.usage === ForgetPasswordMode) {
      response = await service.sendForgetPasswordCaptcha(body);
    } else if (props.usage === SignupMode) {
      response = await service.sendSignupCaptcha(body);
    } else {
      throw "invalid props usage";
    }
    const data = response.data.data;
    startCountdown(data.created_at);
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg,
      position: "top",
    });
  }

  resendLoading.value = false;
}
</script>

<style lang="css" scoped></style>
