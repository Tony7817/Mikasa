<template>
  <q-dialog persistent :model-value="props.show" full-width>
    <q-card class="bg-grey-10">
      <q-card-section>
        <div class="row items-center">
          <q-btn class="col-1" flat dense icon="arrow_back" @click="close" />
          <div class="col text-center text-h6">Enter the verification code</div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center" style="font-size: 16px">
          A verification code is sent to
        </div>
        <div class="text-primary text-center">
          {{ props.target }}
        </div>
        <q-input
          class="q-mx-md"
          type="text"
          dense
          autofocus
          maxlength="6"
          v-model="verificationCode"
          @keydown="handleKeydown($event)"
        />
        <div v-if="isIncorrectShown" class="text-center text-red">
          incorrect verification code.
        </div>
      </q-card-section>
      <q-card-section>
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
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, watch, computed } from "vue";
import { DateTime } from "luxon";
import { service } from "src/services/api";
import { Email, ForgetPasswordMode, SignupMode } from "src/composables/consts";

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
const $q = useQuasar();

const remainingTime = ref(0);
const isButtonDisabled = ref(false);
const countdownInterval = ref(null);
const resendLoading = ref(false);
const verificationCode = ref("");
const verifyLoading = ref(false);
const isIncorrectShown = ref(false);

const resetPrompt = computed(() => {
  return remainingTime.value > 0
    ? `Resend in ${remainingTime.value}s`
    : "Resend";
});

const emit = defineEmits(["disable-dialog", "callback"]);

function startCountdown(createdAt) {
  const cooldownPeriod = 60; // 冷却时间（秒）

  // 计算剩余时间
  const createdTime = DateTime.fromMillis(createdAt * 1000);
  const now = DateTime.now();
  const diffInSeconds = Math.max(
    0,
    Math.floor(cooldownPeriod - now.diff(createdTime, "seconds").seconds)
  );

  // 设置剩余时间和禁用按钮
  remainingTime.value = diffInSeconds;
  isButtonDisabled.value = diffInSeconds > 0;

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

watch(verificationCode, async (newCode) => {
  if (newCode.length === 6) {
    await verifyCode();
  }
});

watch(
  () => props.captchaTime,
  (newValue) => {
    if (newValue > 0) {
      startCountdown(newValue);
    }
  },
  { immediate: true }
);

function close() {
  verificationCode.value = "";
  emit("disable-dialog");
}

async function verifyCode() {
  if (verifyLoading.value) {
    return;
  }
  verifyLoading.value = true;

  try {
    const body = { captcha: verificationCode.value };
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
    }
  } catch (error) {
    isIncorrectShown.value = true;
    $q.notify({
      type: "negative",
      message: error?.response?.data?.msg || "something went wrong",
      position: "top",
    });
  }

  verifyLoading.value = false;
}

function handleKeydown(event) {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
  const isNumberKey = /^[0-9]$/.test(event.key);

  // 限制非数字和非功能键输入
  if (!allowedKeys.includes(event.key) && !isNumberKey) {
    event.preventDefault();
    return;
  }
}

async function resend() {
  if (resendLoading.value) {
    return;
  }

  resendLoading.value = true;

  try {
    const body = {};
    if (props.mode === Email) {
      body.email = props.target;
    } else {
      body.phone_number = props.target;
    }
    const response = {};
    if (props.usage === ForgetPasswordMode) {
      response = await service.sendForgetPasswordCaptcha(body);
    } else if (props.usage === SignupMode) {
      response = await service.sendSignupCaptcha(body);
    } else {
      console.log("invalid");
    }
    const data = response.data.data;
    startCountdown(data.createdAt);
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

<style lang="scss" scoped></style>
