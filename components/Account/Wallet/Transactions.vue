<template>
  <div class="flex flex-col gap-4 items-start py-4">
    <h2 class="md:text-2xl text-lg font-medium leading-9 tracking-tight mb-2">Transaction History</h2>
    
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">An error occurred</p>
    <p v-else-if="transactions.length == 0" class="">
      No transactions made.
    </p>

    <div v-else class="w-full md:h-96 md:overflow-auto border rounded-md shadow-sm">
      <div v-for="item in transactions" :key="item.id">
        <div v-if="item.type === 'deposit'" class="py-4 px-5 flex items-center justify-between gap-12 border-b border-black dark:border-white">
          <div class="space-y-4">
            <h3 class="text-sm md:text-base font-semibold">Deposit</h3>
            <p class="text-xs md:text-sm  font-normal">TNB-{{ item.id }}</p>
          </div>
          <p class="text-secondary-900 dark:text-secondary-600 text-xs md:text-sm  font-normal">
            <span>+</span>
            {{
              new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.amount)
            }}
          </p>
        </div>
        <div v-if="item.type === 'withdrawal'" class="py-4 px-5 flex items-center justify-between gap-12 border-b border-black dark:border-white">
          <div class="space-y-4">
            <h3 class="text-sm md:text-base font-semibold ">
              Withdrawal <sup v-if="item.status != 'completed'" class="text-[8px]
              " >({{ item.status }})</sup>
            </h3>
            <p class="text-xs md:text-sm  font-normal">TNB-{{ item.id }}</p>
          </div>
          <div class="text-sm font-normal space-y-2">
            <p class="text-red-900 dark:text-red-600 ">
              <span>-</span>
              {{
                new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.amount)
              }}
            </p>
            <a class="block cursor-pointer text-center underline text-xs mx-auto" @click="checkWithdrawalStatus(item.reference)" v-if="item.status == 'pending'">Refresh</a>
          </div>
        </div>
        <div v-if="item.type === 'bet_hold'" class="py-4 px-5 flex items-center justify-between gap-12 border-b border-black dark:border-white">
          <div class="space-y-4">
            <h3 class="text-sm md:text-base font-semibold">Bet Hold</h3>
            <p class="text-xs md:text-sm  font-normal">TNB-{{ item.id }}</p>
          </div>
          <p class="text-red-900 dark:text-red-600 text-xs md:text-sm  font-normal">
            <span>-</span>
            {{
              new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.amount)
            }}
          </p>
        </div>
        <div v-if="item.type === 'bet_payout'" class="py-4 px-5 flex items-center justify-between gap-12 border-b border-black dark:border-white">
          <div class="space-y-4">
            <h3 class="text-sm md:text-base font-semibold">Bet Payout</h3>
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
const toast = useToast()

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
        ...data,
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

async function checkWithdrawalStatus(ref) {
  await $fetch('/api/withdraw/verify', {
    method: "POST",
    body: {
      ref: ref
    }
  }).then((res) => {
    const transactionIndex = transactions.value.findIndex(trans => trans.id === ref);
    if (transactionIndex !== -1) {
      transactions.value[transactionIndex].status = res.status;
    }

    toast.add({title: 'Withdrawal status refreshed'})

  }).catch(() => {
    toast.add({title: 'An error occurred', description: 'Contact support if your having transfer issues.', color: 'red'})
  });

}
</script>

