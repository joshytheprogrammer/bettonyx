<template>
  <form class="inline-flex items-center gap-4 text-sm" @submit.prevent="login">
    <div class="flex items-center gap-2" >
      <input class="w-60 px-1 lg:px-2 h-10 outline-none border-0 rounded-md shadow-sm  ring-1 ring-inset ring-gray-300 dark:ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 sm:text-sm sm:leading-6" type="text" placeholder="Phone" v-model="user.phone" @focusout="validate">
      <div class="inline-flex items-center" >
        <input class="w-50 px-1 lg:px-2 h-10 outline-none border-0 rounded-tl-md rounded-bl-md shadow-sm ring-1 ring-inset ring-gray-300  dark:ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 sm:text-sm sm:leading-6" type="password" placeholder="Password" v-model="user.password" @focusout="validate" @keyup="validate">
        <button type="submit" class="inline-flex justify-center items-center bg-primary-900 w-20 text-white font-semibold hover:ring-gray-300 text-center  h-10 rounded-tr-md rounded-br-md" :disabled="loading || !validated">
          <svg v-if="loading"
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.86 3 7.978l3-2.687z"
              ></path>
          </svg>
          <span v-else>Login</span>
        </button>
      </div>
    </div>
    <div>
      <button class=" block text-center w-20 h-10 bg-primary-950 text-white font-semibold  rounded-md">
        <NuxtLink to="/register">Register</NuxtLink>
      </button>
    </div>
  </form>
</template>

<script setup> 
import {
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { useUserStore } from "@/store/user";

const db = useFirestore();
const userStore = useUserStore();
const firebaseAuth = useFirebaseAuth();

const toast = useToast();

const loading = ref(false);
const validated = ref(false);

const user = reactive({
  phone: '',
  email: '',
  password: ''
});

async function login() {
  validate();
  if(!validated){return;}

  loading.value = true

  user.email = user.phone + '@eaglebet.com'

  await signInWithEmailAndPassword(firebaseAuth, user.email, user.password)
  .then(async (credential) => {
    await userStore.setUser({ uid: credential.user.uid })

    await getDoc(doc(db, 'users', credential.user.uid))
    .then((doc) => {
      const { role, createdAt, ...rest } = doc.data();
      const newUser = {id: doc.id, ...rest}

      userStore.setUserData({email: newUser.email, phone: newUser.phone})
    });

    toast.add({ title: 'Authentication successful' })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    toast.add({ title: 'An error occured', description: errorCode, color: 'red'})

    console.error({code: errorCode, message: errorMessage})
    console.error(error)
  }).finally(() => {
    loading.value = false;
  });
}

function validate() {
  if(validatePhone(user.phone) && validatePassword(user.password)) {
    validated.value = true
  } else {
    validated.value = false
  }
}

function validatePhone(phone) {
  const regex = /^((\+)?(234)|0)(7|8|9)(0|1)\d{8}$/;
  return regex.test(phone);
}

function validatePassword(password) {
  // Check password length
  if (password.length < 8) {
    return false;
  }

  return true;
}
</script>

<style lang="scss" scoped>

</style>