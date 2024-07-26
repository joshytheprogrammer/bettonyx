<template>
  <div class="links w-52 h-fit border rounded-md flex flex-col ">
    <NuxtLink class="" to="/account/my">Profile</NuxtLink>
    <NuxtLink class="" to="/account/my/wallet">Wallet</NuxtLink>
    <NuxtLink class="" to="/account/my/bet_history">Bet History</NuxtLink>
    <NuxtLink class="" to="/account/my/support">Customer Support</NuxtLink>
    <span @click="logout" class="px-4 py-2 cursor-pointer hover:bg-red-800  hover:text-white" to="/account/my/support">Logout</span>
    
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import {
  signOut,
} from 'firebase/auth'

const userStore = useUserStore();

const auth = useFirebaseAuth();

async function logout() {
  const sure = confirm("Are you sure you want to terminate your session?");

  if(!sure) return

  await signOut(auth)
  await userStore.clearUser()
  navigateTo('/login')
}
</script>

<style lang="postcss" scoped>
.links a {
  @apply px-4 py-2 hover:bg-primary-600 hover:text-white dark:text-white  cursor-pointer;
}

.links .router-link-exact-active {
  @apply bg-primary-700 dark:bg-primary-800 dark:bg-primary-800 text-white; 
}

</style>