<template>
  <div class="flex flex-col-reverse gap-8 justify-start rounded-md px-4 py-6 bg-primary-700 text-white" >
    <div class="flex items-center">
      <p class="mr-8 font-bold text-lg md:text-3xl text-white">
        {{ 
          new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'}).format(balance)
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
    <div class="uppercase text-left text-base md:text-lg font-bold">
      <h1 class="" >Holding Account</h1>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { 
  collection,
  getDocs,
  where,
  query
} from 'firebase/firestore'

const db = useFirestore();
const userStore = useUserStore();
const loading = ref(false);
const balance = ref(0)


if (userStore.isAuthenticated) {
  await getBalance();
}

async function getBalance() {
  const uid = userStore.getUser.uid; // If User is authenticated.
  loading.value = true;

  try {
    // Query the 'holding_accounts' collection for entries with status 'holding'
    const holdingAccountsRef = collection(db, 'holding_accounts');
    const q = query(holdingAccountsRef, where('uid', '==', uid), where('status', '==', 'holding'));
    const querySnapshot = await getDocs(q);

    // Sum up the holding amounts
    let holdingBalance = 0;
    querySnapshot.forEach((doc) => {
      holdingBalance += parseFloat(doc.data().amount);
    });

    // Combine the user balance with the holding balance
    balance.value = holdingBalance;
} catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}


async function reloadBalance() {
  await getBalance();
}
</script>

<style lang="scss" scoped>

</style>
