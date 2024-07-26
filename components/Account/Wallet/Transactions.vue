<template>
  <div class="flex flex-col gap-4 items-start py-4">
    <h2 class="md:text-2xl text-lg font-medium leading-9 tracking-tight mb-2">Transaction History</h2>
    
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">An error occurred</p>
    <p v-else-if="transactions.length == 0" class="">
      No transactions made.
    </p>

    <div v-else class="w-full md:h-96 md:overflow-auto border rounded-md shadow-sm">
      <div v-for="item in transactions" :key="item.id" class="py-4 px-5 flex items-center justify-between gap-12 border-b border-black dark:border-white">
        <div class="space-y-4">
          <h3 class="text-sm md:text-base font-semibold">
            {{ getItemTitle(item) }}
            <sup v-if="item.type === 'withdrawal' && item.status != 'completed'" class="text-[8px]">({{ item.status }})</sup>
          </h3>
          <p class="text-[8px] md:text-sm font-normal">TNB-{{ item.id }}</p>
        </div>
        <div :class="getAmountClass(item)">
          <span>{{ getAmountSign(item) }}</span>
          {{
            new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.amount)
          }}
          <a v-if="item.type === 'withdrawal' && item.status == 'pending'" class="block cursor-pointer text-center underline text-xs mx-auto" @click="checkWithdrawalStatus(item.reference)">
            Refresh
          </a>
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

function getItemTitle(item) {
  switch (item.type) {
    case "deposit":
      return "Deposit";
    case "withdrawal":
      return "Withdrawal";
    case "bet_hold":
      return "Bet Hold";
    case "bet_payout":
      return "Bet Payout";
    default:
      return "";
  }
}

function getAmountClass(item) {
  return item.type === "withdrawal" || item.type === "bet_hold" 
    ? "text-red-900 dark:text-red-600 text-xs md:text-sm font-normal space-y-2" 
    : "text-primary-900 dark:text-primary-600 text-xs md:text-sm font-normal";
}

function getAmountSign(item) {
  return item.type === "deposit" || item.type === "bet_payout" ? "+" : "-";
}
</script>

