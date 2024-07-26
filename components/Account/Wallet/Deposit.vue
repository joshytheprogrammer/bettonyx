<template>
  <div class="flex flex-col pt-4" >
    <h2 class="md:text-2xl text-lg font-medium leading-9 tracking-tight ">Deposit Slip</h2>
    <div class="py-4">
      <form v-if="!verify" class="flex flex-col gap-4" @submit.prevent="submit">
        <UInput class="text-xs" type="text" placeholder="Enter deposit amount" v-model="amount" />
        <div class="flex justify-between items-center">
          <UButton :loading="loading" class="bg-primary-900 w-fit py-4 px-5 md:py-2 md:px-3 "type="submit">Deposit</UButton>
          <NuxtLink to="/account/my/wallet" class="text-red-400 underline text-sm" >Close</NuxtLink>
        </div>
      </form>
      <div class="w-full space-y-4" v-else>
        <!-- <UAlert
        title="Note"
        class="w-full"
        variant="solid"
        description="If your verification is taking time. Save this code. You will need it for customer support. -- us9ImAWLMhKS95C --"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: true }"
        /> -->
        <p class="bg-primary-800 px-2 py-2 text-sm rounded-md" >If your verification is taking too long. Contact customer support with this ID <code>{{route.query.reference}}</code></p>
        <HelpersLoaderDot />
        <p v-if="depositAmount" class="text-sm md:text-base">
          Verifying 
          <span class="font-semibold">
            {{ 
              new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'}).format(depositAmount)
            }}
          </span> 
          Deposit
        </p>
      </div>
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
const toast = useToast();

const route = useRoute();
const router = useRouter();

const amount  = ref('');
const loading = ref(false);
const verify = ref(false);
const depositAmount = ref(null); 

const { generateTransactionReference } = useCreateUtilities();

// Update the reactive property based on the route query
watchEffect(() => {
  verify.value = route.query.verify || false;
  
});

onMounted(async () => {
  if (verify.value) {
    const reference = route.query.reference;
    depositAmount.value = parseFloat(route.query.amount); 

    await $fetch('/api/deposit/verify', {
      method: 'POST',
      body: {
        uid: userStore.getUser.uid,
        ref: reference,
        depositAmount: depositAmount.value
      }
    }).then((res) => {
      toast.add({title: 'Deposit successful'})
    }).catch((error) => {
      console.error('Deposit verification failed:', error);
      toast.add({title: 'Deposit failed', color: 'red'})
    }).finally(async () => {
      await getBalance();
      verify.value = false;
      router.push('/account/my/wallet');
    })

  }
})

async function submit() {
  if(!validate()){return}
  loading.value = true

  try {
    await $fetch('/api/deposit/initialize', {
      method: "POST",
      body: { 
        formData: {
          amount: amount.value,
          email: userStore.getUserData.email,
          reference: generateTransactionReference(),
        }
      }
    }).then((res) => {
      navigateTo(res.data.authorization_url, { external: true })
    });
  }catch (e) {
    console.log(e)
  }finally {
    loading.value = false
  }
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