<template>
  <div class="flex flex-col items-start justify-start gap-4">
    <h2 class="text-base md:text-2xl pt-8 pb-4 font-medium underline leading-8 decoration-secondary-900 dark:decoration-secondary-600 underline-offset-8	decoration-2 text-gray-900 dark:text-gray-200">Your Withdrawal Accounts</h2>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">An error occurred</p>
    <div v-else class="text-base font-medium leading-6">
      <p v-if="withdrawal_accounts.length == 0" class="">
        No accounts found
      </p>
      <div v-else class="grid gap-8 grid-cols-1 md:grid-cols-2">
        <div v-for="item in withdrawal_accounts" :id="item.id" class="bg-secondary-700 text-white dark:bg-secondary-950  rounded-md flex justify-between items-center gap-8 px-8 py-4">
          <div class="md:space-y-2 space-y-4">
            <h2 class="text-sm font-semibold" >{{ item.bank.name }}</h2>
            <p class="text-xs md:text-sm leading-8 font-normal uppercase" >{{ item.name }}</p>
            <p class="text-sm font-normal">{{ item.number.slice(0, 3) + '****' + item.number.slice(7) }}</p>
          </div>
          <button @click="deleteItem(item.id)" class="bg-red-500 dark:bg-red-900 py-2 px-3 h-fit w-fit rounded-md shadow-md text-base md:text-lg font-semibold" >
            <UIcon name="i-carbon-trash-can"/>
          </button>
        </div>
      </div>
      <AccountHelpersNewAccountLink />
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { collection, query, where, doc, getDocs, deleteDoc } from 'firebase/firestore'

const db = useFirestore();
const userStore = useUserStore();
const toast = useToast();

const loading = ref(true);
const error = ref(false);

const uid = userStore.getUser.uid;
const withdrawal_accounts = ref([]);

try {
  const accountsSnapshot = await getDocs(
    query(
      collection(db, 'withdrawal_accounts'), 
      where('uid', '==', uid)
    )
  );

  if (accountsSnapshot.empty) {
  } else {
    accountsSnapshot.forEach((doc) => {
      withdrawal_accounts.value.push({id:doc.id, ...doc.data()});
    });
  }
} catch (e) {
  error.value = true;
} finally {
  loading.value = false;
}

async function deleteItem(id) {
  const c = confirm("Are you sure you want to delete this account?")

  if(!c){return}

  try {
    await deleteDoc(doc(db, 'withdrawal_accounts', id));
    withdrawal_accounts.value = withdrawal_accounts.value.filter(account => account.id !== id);
    toast.add({title: "Account deleted successfully."});
  } catch (e) {
    error.value = true;
    console.log(e);
    toast.add({title: 'Failed to delete account.', color: "red"});
  }
}
</script>

<style lang="scss" scoped>

</style>