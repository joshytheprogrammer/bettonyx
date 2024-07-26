<template>
  <section class="register w-full py-8 px-4 rounded-xl lg:shadow-lg" id="register">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">Create an account </h2>
    </div>

    <div class="mt-10 w-full sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="register">
        <div>
          <label class="block text-sm font-medium leading-6 ">Phone</label>
          <div class="mt-2">
            <input type="text" autocomplete="phone" required class="block w-full rounded-md border-0 p-1.5 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 text-xs sm:text-sm sm:leading-6" v-model="user.phone" placeholder="Enter your phone number">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium leading-6 ">Email address</label>
          <div class="mt-2">
            <input type="email" autocomplete="email" required class="block w-full rounded-md border-0 p-1.5  shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 text-xs sm:text-sm sm:leading-6" v-model="user.email" placeholder="Enter your email address">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium leading-6 ">Password</label>
          <div class="mt-2">
            <input type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 p-1.5  outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 text-xs sm:text-sm sm:leading-6" v-model="user.password" placeholder="Enter your password">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium leading-6 ">Confirm Password</label>
          <div class="mt-2">
            <input type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 p-1.5  outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 text-xs sm:text-sm sm:leading-6" v-model="confirmPassword" placeholder="Re enter your password">
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-primary-800 py-4 md:py-1.5  text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
            v-if="!loading"
          >
            Create account
          </button>
          <button
            type="button"
            class="flex w-full justify-center items-center rounded-md bg-primary-800  py-4 md:py-1.5  text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800 cursor-not-allowed " 
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
            Creating...
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Already have an account?
        <NuxtLink to="/login" class="font-semibold leading-6 text-primary-800 hover:text-primary-700">Login</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import {
  createUserWithEmailAndPassword,
} from 'firebase/auth'

import { doc, setDoc, Timestamp } from "firebase/firestore"; 

import { useUserStore } from "@/store/user";

const userStore = useUserStore();

const firebaseAuth = useFirebaseAuth();
const db = useFirestore();

const toast = useToast();

const loading = ref(false);
const validated = ref(false);

const user = reactive({
  phone: '',
  email: '',
  password: ''
});
const confirmPassword = ref('')

async function register() {
  validate();
  if(!validated){return;}

  loading.value = true;

  const loginEmail = user.phone + '@eaglebet.com';

  // Create user with email and password
  await createUserWithEmailAndPassword(firebaseAuth, loginEmail, user.password)
  .then(async (credential) => {

    // Create user in firebase
    await $fetch('/api/auth/register', {
      // baseURL: useRuntimeConfig().public.baseURL,
      method: "POST",
      body: {
        uid: credential.user.uid,
        email: user.email,
        phone: user.phone
      },
    })

    await userStore.setUser({ uid: credential.user.uid });
    await userStore.setUserData({email: user.email, phone: user.phone})

    toast.add({ title: 'Account created successfully', description: 'Deposit to start betting' })

    navigateTo('/account/my');
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    toast.add({ title: 'An error occured', description: errorCode, color: 'red'})

    console.error({code: errorCode, message: errorMessage})
    console.error(error)
  })
  .finally(() => {
    loading.value = false
  })
}

function validate() {
  if(validateEmail(user.email) && validatePhone(user.phone) && validatePassword(user.password)) {
    validated.value = true
  } else {
    validated.value = false
  }
}


function validateEmail(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[a-zA-Z]{2,})$/;
  return regex.test(email);
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

  if(password != confirmPassword) {
    return false;
  }

  return true;
}
</script>

<style lang="scss" scoped>

</style>