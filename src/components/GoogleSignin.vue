<template>
  <div>
    <div id="g_id_signin"></div>
    <div v-if="loading" class="row justify-center">
      <q-spinner class="q-mt-md" size="2em" v-model="loading" />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { SigninMode, SignupMode } from "src/composables/consts";
import { service } from "src/services/api";
import { useUserStore } from "src/stores/user";
import { onMounted } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => [SigninMode, SignupMode].includes(value),
  },
});

const userInfo = ref(null);
const loadGoogleSDK = async () => {
  await new Promise((resolve) => {
    if (document.getElementById("google-sdk")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "google-sdk";
    script.src = "https://accounts.google.com/gsi/client?hl=en_US";
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

const initializeGoogleLogin = () => {
  window.google.accounts.id.initialize({
    client_id:
      "178808795922-7njfrkr6jrvh2iido7avk7lh2ok72a4l.apps.googleusercontent.com", // 替换为实际的 Client ID
    callback: handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(
    document.getElementById("g_id_signin"),
    {
      type: "standard",
      size: "medium",
      theme: "filled_black",
      shape: "pill",
      text: props.mode === SigninMode ? "signin_with" : "signup_with",
    } // 自定义按钮样式
  );

  window.google.accounts.id.prompt(); // 显示弹窗
};

const loading = ref(false);
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
async function signin(token) {
  if (loading.value) {
    return;
  }

  loading.value = true;

  try {
    const response = await service.signinWithGoogle({ token: token });
    const data = response.data.data;
    if (data.user_id) {
      userStore.setUser({
        id: data.user_id,
        name: data.name,
        token: data.access_token,
        avatarUrl: data.avatar_url,
      });
      const redirectPath = route.query.next || "/";
      router.push(redirectPath);
    }
  } catch (error) {
    console.log(error);
    $q.notify({
      type: "negative",
      message: error?.response?.data?.message || "Something went wrong",
      position: "top",
    });
  }

  loading.value = false;
}

const handleCredentialResponse = async (response) => {
  console.log("Encoded JWT ID token: ", response.credential);
  // 你可以解码 JWT 获取用户信息
  await signin(response.credential);
};
const handleLogin = () => {
  window.google.accounts.id.prompt();
};

const handleSignOut = () => {
  window.google.accounts.id.disableAutoSelect(); // 禁用自动登录
  userInfo.value = null;
  alert("You have signed out.");
};

onMounted(async () => {
  await loadGoogleSDK();
  initializeGoogleLogin();
});
</script>
