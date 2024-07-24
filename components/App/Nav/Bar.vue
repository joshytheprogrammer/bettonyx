<template>
  <div class="hidden lg:block">
    <nav class="bg-main-800 w-full px-4 sm:px-8 md:px-8 lg:px-18 py-8 ">
      <div class="lg:max-w-[80%] flex items-center justify-between mx-auto">
        <div class="w-fit">
          <NuxtLink to="/">
            <!-- <Icon class="text-green-800" size="4em" name="ph:car-fill" /> -->
            <h1 class="font-bold text-xl md:text-2xl lg:text-4xl px-2 text-white"> 
              BettonyX<sup class="text-xs text-white pr-2">™</sup>
              <sup class="text-xs bg-secondary-800 text-white p-1 rounded-md">Beta</sup>
            </h1>
          </NuxtLink>
        </div>
        <div class="inline-flex justify-center items-center gap-4">
          <AuthNavLogin v-if="!userStore.isAuthenticated" />
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
          <UButton v-if="userStore.isAuthenticated" @click="logout" >Logout</UButton>
        </div>
      </div>
    </nav>   
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import {
  signOut,
} from 'firebase/auth'

const auth = useFirebaseAuth();
const userStore = useUserStore();
const colorMode = useColorMode();

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
});

async function logout() {
  await signOut(auth)
  await userStore.clearUser()
  navigateTo('/login')
}
</script>

<style lang="scss" scoped>

</style>