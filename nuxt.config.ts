// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    paystackSecretKey: '',
    public: {
      baseUrl: ''
    },
  },
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-vuefire"],
  vuefire: {
    auth: {
      enabled: true
    },
    config: {
      apiKey: "AIzaSyDVjAQQu3BoDCdb-47gTLp1PKw9853phHA",
      authDomain: "eaglebet-jtp.firebaseapp.com",
      projectId: "eaglebet-jtp",
      storageBucket: "eaglebet-jtp.appspot.com",
      messagingSenderId: "294873641657",
      appId: "1:294873641657:web:783d2e944bd9d688dae168",
      measurementId: "G-V7T926R3VT"
    },
  },
})