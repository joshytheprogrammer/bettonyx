<template>
  <section class="register w-full py-8 px-4 rounded-xl lg:shadow-lg" id="login">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">Claim your winnings </h2>
    </div>

    <div v-if="!userStore.isAuthenticated" class="mt-10 w-full sm:mx-auto sm:w-full sm:max-w-sm">
      <form  class="space-y-6" @submit.prevent="login">
        <div>
          <label class="block text-sm font-medium leading-6 ">Phone</label>
          <div class="mt-2">
            <input type="text" autocomplete="phone" required class="block w-full rounded-md border-0 p-1.5 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary-800 text-xs sm:text-sm sm:leading-6" v-model="user.phone" placeholder="Enter your phone number">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium leading-6 ">Password</label>
          <div class="mt-2">
            <input type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 p-1.5  outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary-800 text-xs sm:text-sm sm:leading-6" v-model="user.password" placeholder="Enter your password">
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-secondary-800 px-3 py-4 md:py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-800"
            v-if="!loading"
          >
            Login
          </button>
          <button
            type="button"
            class="flex w-full justify-center items-center rounded-md bg-secondary-800 px-3 py-4 md:py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-800 cursor-not-allowed " 
            disabled
            v-else
          >
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Checking...
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Don't have an account?
        <NuxtLink to="/register" class="font-semibold leading-6 text-secondary-800 hover:text-secondary-700">Register</NuxtLink>
      </p>
    </div>

    <div v-else class="sm:mx-auto sm:w-full sm:max-w-sm">
      <p class="mt-10 text-center font-bold leading-9 tracking-tight ">Redirecting...</p>
      <p class="text-center leading-9 tracking-tight " >If this delays - <NuxtLink class="font-semibold text-sm underline text-secondary-800" to="/account/my">Refresh Now</NuxtLink></p>
    </div>

    
  </section>
</template>

<script setup>
import {
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { useUserStore } from "@/store/user";

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
    toast.add({ title: 'Authentication successful' })

    navigateTo('/account/my');
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