// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  // plugins: ['~/plugins/custom-reducer.js'],
  runtimeConfig: {
    paystackSecretKey: '',
    public: {
      baseUrl: ''
    },
    callbackUrl: '',
    googleApplicationCredentials: ''
  },
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-vuefire", "nuxt-tiptap-editor"],
  tiptap: {
    prefix: "Tiptap", //prefix for Tiptap imports, composables not included
  },
  vuefire: {
    auth: {
      enabled: true
    },
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    }
  },
})
