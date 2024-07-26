<template>
  <div class="flex flex-col pt-4" >
    <h2 class="md:text-2xl text-lg font-medium leading-9 tracking-tight ">Withdrawal Slip</h2>
    <div class="py-4">
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <UInput class="text-xs" type="text" placeholder="Enter withdrawal amount" v-model="amount" />
        <USelectMenu 
        placeholder="Select transfer recipient" 
        v-model="recipientCode" 
        :options="withdrawal_accounts" 
        value-attribute="recipientCode"
        option-attribute="number"
        />
        <div class="flex justify-between items-center gap-8">
          <UButton :loading="loading" class="bg-primary-900 w-fit py-4 px-5 md:py-2 md:px-3 "type="submit">Initiate Withdrawal</UButton>
          <NuxtLink to="/account/my/wallet" class="text-red-400 underline text-sm" >Close</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { 
  doc, 
  getDoc,
  getDocs,
  collection, query, where,
} from 'firebase/firestore'

const db = useFirestore();
const userStore = useUserStore();
const toast = useToast();

const route = useRoute();
const router = useRouter();

const uid = userStore.getUser.uid;
const withdrawal_accounts = ref([]);
const recipientCode = ref('')
const amount  = ref('');
const loading = ref(false);

const { generateTransactionReference } = useCreateUtilities();

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

async function submit() {
  if(!validate()){return}
  loading.value = true

  try {
    await $fetch('/api/withdraw/initialize', {
      method: "POST",
      body: { 
        formData: {
          uid: uid,
          code: recipientCode.value,
          amount: amount.value,
          reference: generateTransactionReference(),
        }
      }
    }).then(async (res) => {
      toast.add({title: 'Success', description: res})
      await getBalance()
      router.push('/account/my/wallet')
    });
  }catch (e) {
    toast.add({title: 'An error occurred', description: 'Check console for more or contact support', color: 'red'})
    console.log(e)
  }finally {
    loading.value = false
  }
}

async function getBalance() {
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

function validate() {
  amount.value = Number(amount.value);

  if (isNaN(amount.value) || !Number.isInteger(amount.value)) {
    toast.add({ title: 'Validation Error', description: 'Amount must be an integer', color: 'red' });
    return false;
  }

  if (amount.value < 200) {
    toast.add({ title: 'Validation Error', description: 'Amount must be at least 200', color: 'red' });
    return false;
  }

  return true;
}



</script>

<style lang="scss" scoped>

</style>