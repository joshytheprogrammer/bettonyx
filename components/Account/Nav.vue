<template>
  <div class="links w-52 h-fit border border-slate-500 flex flex-col ">
    <NuxtLink class="" to="/account/my">Profile</NuxtLink>
    <NuxtLink class="" to="/account/my/wallet">Wallet</NuxtLink>
    <NuxtLink class="" to="/account/my/bet_history">Bet History</NuxtLink>
    <!-- <NuxtLink class="" to="/account/my/transactions">Transactions</NuxtLink> -->
    <div class=" px-4 py-2 hover:bg-red-800  hover:text-white" >
      <UPopover class="w-full">
        <p class="logout dark:text-white cursor-pointer"  >Logout</p>

        <template #panel>
          <div class="p-4">
            <h2 class="pb-4 hover:text-black dark:hover:text-white"> You are about to terminate your session</h2>
            <UButton color="red" label="Proceed" @click="logout" class="text-xs p-4" />
          </div>
        </template>
      </UPopover>
    </div>
    
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
  await signOut(auth)
  await userStore.clearUser()
  navigateTo('/login')
}
</script>

<style lang="postcss" scoped>
.links a {
  @apply px-4 py-2 hover:bg-secondary-600 hover:text-white dark:text-white  cursor-pointer;
}

.links .router-link-exact-active {
  @apply bg-secondary-700 dark:bg-secondary-800 text-white; 
}

</style>