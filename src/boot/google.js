import { boot } from "quasar/wrappers";
import vue3GoogleLogin from 'vue3-google-login'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.use(vue3GoogleLogin, {
    clientId: "178808795922-7njfrkr6jrvh2iido7avk7lh2ok72a4l.apps.googleusercontent.com"
  })
});
