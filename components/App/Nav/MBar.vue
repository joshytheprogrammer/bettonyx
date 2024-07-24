<template>
  <nav class="flex lg:hidden justify-between items-center m-auto max-w-full text-center p-0 rounded-none border-0 bg-none bg-main-800 px-4 sm:px-8 md:px-8 lg:px-18 py-8 ">
    <div class="w-fit">
      <a aria-current="page" href="/" class="router-link-active router-link-exact-active flex items-center space-around no-underline">
        <!-- <Icon class="text-green-800" size="4em" name="ph:car-fill" /> -->
        <h1 class="font-bold text-base md:text-2xl lg:text-4xl px-2 text-white"> 
          BettonyX <sup class="text-xs text-white pr-2">™</sup>
          <sup v-if="!userStore.isAuthenticated" class="text-[8px] bg-secondary-800 text-white p-1 rounded-md">Beta</sup>
        </h1>
      </a>
    </div>
    <div class="flex gap-2 items-center">
      <div class="flex gap-2 items-center" v-if="!userStore.isAuthenticated">
        <button class="text-xs block text-center px-2 py-4 bg-secondary-800 text-white md:font-semibold rounded-md">
          <NuxtLink to="/login">Login</NuxtLink>
        </button>
        <button class="text-xs block text-center px-2 py-4 bg-transparent text-white md:font-semibold rounded-md border-2 border-secondary-800 ">
          <NuxtLink to="/register">Register</NuxtLink>
        </button>
      </div>
      <div class="inline-flex justify-center items-center gap-4" v-else>
        <AppNavBalance />
        
        <NuxtLink to="/account/my">
          <UAvatar
            size="lg"
            src="https://avatars.githubusercontent.com/u/739984?v=4"
            alt="Avatar"
          />
        </NuxtLink>
      </div>
      <div>
        <UButton
          :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
          color="white"
          variant="ghost"
          aria-label="Theme"
          @click="isDark = !isDark"
        />
      </div>
      <div class="toggleMenu text-white" @click="toggleMenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z"/></svg>
      </div>
    </div>
      <!-- Mobile Nav -->
    <div class="mobile-nav flex fixed w-full h-full bg-white dark:bg-gray-900 flex-col items-center justify-center z-[1000] left-0 top-0" v-show="menuShowing">
      <div class="close-btn absolute text-[2rem] text-black cursor-pointer right-4 top-4" @click="toggleMenu">&times;</div>
      <div class="flex flex-col gap-4 items-center">
        <!-- <div class="">
          <h2 class="text-lg font-semibold py-4">Login Shap Shap</h2>
          <AuthNavLogin />
        </div> -->
        <div class="links flex flex-col gap-4 border border-primary-800 px-4 py-8">
          <NuxtLink to="/account/my">Profile</NuxtLink>
          <NuxtLink to="/account/my/wallet">Wallet</NuxtLink>
          <NuxtLink to="/account/my/bet_history">Bet History</NuxtLink>
          <NuxtLink to="/account/my/wallet">Transaction History</NuxtLink>
        </div>
        
        <button @click="toggleMenu" class="bg-red-600 rounded-md px-4 py-2 ">Close</button>
        
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from "@/store/user";

const route = useRoute();
const userStore = useUserStore();

const menuShowing = ref(false);

function toggleMenu() {
  menuShowing.value = !menuShowing.value
}

watch(() => route.fullPath, () => {
  menuShowing.value = false;
});

const colorMode = useColorMode()

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
});
</script>

<style lang="postcss" scoped>
nav .links a {
  @apply text-inherit px-4 py-0;
}
</style>