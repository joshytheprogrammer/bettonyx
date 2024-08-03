<template>
  <div class="flex flex-col w-full gap-4" >
    <div class="  " v-if="withdrawalMethod === 'Manual'">
        <p class="bg-yellow-600 dark:bg-yellow-800 text-white px-2 py-2 text-xs md:text-sm rounded-md" >
          Your withdrawal request will be processed manually. It will be submitted to our customer service team, and the corresponding amount will be deducted from your account balance. You can expect to receive your transfer within 24 hours.
        </p>
      </div>
    <h2 class="md:text-2xl text-lg font-medium leading-9 tracking-tight ">Withdrawal Slip</h2>
      
    <div class="py-4">
      <form class="flex lg:max-w-[30%] flex-col gap-4" @submit.prevent="submit">
        <UInput class="text-xs" type="text" placeholder="Enter withdrawal amount" v-model="amount" />
        <USelect
          color="primary"
          variant="outline"
          v-model="withdrawalMethod"
          :options="[ 'Manual', 'Automatic']" 
          placeholder="Select withdrawal method"
        />
        <USelectMenu 
          :loading="loading"
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
const loading = ref(true);

const withdrawalMethod = ref('Manual'); //Automatic

const { generateTransactionReference } = useCreateUtilities();

const accountsSnapshot = await getDocs(
  query(
    collection(db, 'withdrawal_accounts'), 
    where('uid', '==', uid)
  )
).finally(()=> {loading.value=false});

if (accountsSnapshot.empty) {
} else {
  accountsSnapshot.forEach((doc) => {
    withdrawal_accounts.value.push({id:doc.id, ...doc.data()});
  });
}

async function submit() {
  if(!validate()){return}

  if(withdrawalMethod.value === 'Automatic') {
    await automaticWithdrawal()
  }else if(withdrawalMethod.value === 'Manual') {
    await manualWithdrawal()
  }

}

async function manualWithdrawal() {
  loading.value = true;

  const accountDetails = withdrawal_accounts.value.find(acc => acc.recipientCode === recipientCode.value);

  try {
    await $fetch('/api/withdraw/manual', {
      method: "POST",
      body: { 
        formData: {
          uid: uid,
          accountDetails: accountDetails,
          amount: amount.value,
          reference: generateTransactionReference(),
        }
      }
    }).then(async (res) => {
      toast.add({title: 'Success', description: 'Check support tab for more'})
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

async function automaticWithdrawal() {
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

  if (recipientCode.value === ''){
    toast.add({ title: 'Validation Error', description: 'Recipient must be selected', color: 'red' });
    return false;
  }

  return true;
}



</script>

<style lang="scss" scoped>

</style>