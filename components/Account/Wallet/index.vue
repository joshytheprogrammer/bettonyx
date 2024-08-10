<template>
  <div class="flex flex-col gap-8 justify-start rounded-md px-4 py-6 bg-primary-700 dark:bg-primary-800" >
    <div class="flex items-center">
      <p class="mr-8 font-bold md:text-3xl text-lg text-white">
        {{ 
          new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'}).format(userStore.getBalance)
        }}
      </p>
      <UTooltip text="Reload" :popper="{ arrow: true }">
      <button @click="reloadBalance" :disabled="loading" class="focus:outline-none">
        <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6M4 4l16 16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-spin text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v2m0 12v2m8-8h2M4 12H2m15.36 6.36l1.42 1.42M6.34 6.34L4.93 4.93m12.02 12.02l1.42-1.42M6.34 17.66l-1.42 1.42" />
        </svg>
      </button>
    </UTooltip>
    </div>
    <div class="flex justify-between items-center gap-8 text-sm font-semibold" v-show="userIsActive">
      <NuxtLink class="bg-white rounded-md px-4 md:py-2 py-4  text-primary-900 " to="?action=deposit">Fund Account</NuxtLink>
      <NuxtLink class="text-white" to="?action=withdraw" >Withdraw</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { 
  doc, 
  getDoc,
} from 'firebase/firestore'

const db = useFirestore();
const userStore = useUserStore();
const loading = ref(false);

const userIsActive = ref(userStore.getUserData.status === 'active');

if (userStore.isAuthenticated) {
  await getBalance();
}

async function getBalance() {
  const uid = userStore.getUser.uid; // If User is authenticated.

  await getDoc(doc(db, 'users', uid))
  .then((doc) => {
    const balance = doc.data().balance;
    userStore.setUserBalance(balance);
  })
  .catch((e) => {
    console.log(e);
  }).finally(() => {
    loading.value = false;
  })
}

async function reloadBalance() {
  loading.value = true;
  await getBalance();
}
</script>

<style lang="scss" scoped>

</style>
