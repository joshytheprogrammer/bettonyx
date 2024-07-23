<template>
  <div class="flex flex-col gap-4 items-start py-4">
    <h2 class="md:text-2xl text-lg font-medium leading-9 tracking-tight mb-2">Transaction History</h2>
    
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">An error occurred</p>
    <p v-else-if="transactions.length == 0" class="">
      No transactions made.
    </p>

    <div v-else class="w-full h-96 overflow-auto border rounded-md shadow-sm">
      <div v-for="item in transactions" :key="item.id">
        <div v-if="item.type === 'deposit'" class="py-4 px-5 flex items-center justify-between gap-8 border-b border-black dark:border-white">
          <div class="space-y-2">
            <h3 class="text-base md:text-sm font-semibold">Deposit</h3>
            <p class="text-xs md:text-sm  font-normal">TNB-{{ item.id }}</p>
          </div>
          <p class="text-secondary-900 dark:text-secondary-600 text-xs md:text-sm  font-normal">
            <span>+</span>
            {{
              new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.amount)
            }}
          </p>
        </div>
        <div v-if="item.type === 'withdraw'" class="py-4 px-5 flex items-center justify-between gap-8 border-b border-black dark:border-white">
          <div class="space-y-2">
            <h3 class="text-base md:text-sm font-semibold">Withdrawal</h3>
            <p class="text-xs md:text-sm  font-normal">TNB-{{ item.id }}</p>
          </div>
          <p class="text-red-900 dark:text-red-600 text-sm font-normal">
            <span>-</span>
            {{
              new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.amount)
            }}
          </p>
        </div>
        <div v-if="item.type === 'bet_hold'" class="py-4 px-5 flex items-center justify-between gap-8 border-b border-black dark:border-white">
          <div class="space-y-2">
            <h3 class="text-base md:text-sm font-semibold">Bet Hold</h3>
            <p class="text-xs md:text-sm  font-normal">TNB-{{ item.id }}</p>
          </div>
          <p class="text-red-900 dark:text-red-600 text-xs md:text-sm  font-normal">
            <span>-</span>
            {{
              new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.amount)
            }}
          </p>
        </div>
        <div v-if="item.type === 'bet_payout'" class="py-4 px-5 flex items-center justify-between gap-8 border-b border-black dark:border-white">
          <div class="space-y-2">
            <h3 class="text-base md:text-sm font-semibold">Bet Payout</h3>
            <p class="text-xs md:text-sm  font-normal">TNB-{{ item.id }}</p>
          </div>
          <p class="text-secondary-900 dark:text-secondary-600 text-xs md:text-sm  font-normal">
            <span>+</span>
            {{
              new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.amount)
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

const db = useFirestore();
const userStore = useUserStore();

const loading = ref(true);
const error = ref(false);
const transactions = ref([]);

const uid = userStore.getUser.uid;

try {
  const transSnapshot = await getDocs(
    query(
      collection(db, 'transactions'), 
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    )
  );

  if (!transSnapshot.empty) {
    transSnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.value.push({
        id: doc.id,
        type: data.type,
        amount: data.amount,
        createdAt: new Date(data.createdAt)
      });
    });
  }
} catch (e) {
  error.value = true;
  console.log(e)
} finally {
  loading.value = false;
}

</script>

