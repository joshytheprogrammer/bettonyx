<template>
  <div class="flex flex-col gap-4 items-start">
    <UAlert
      @close="closeAlert"
      v-if="alertShowing"
      color="yellow"
      variant="solid"
      title="Heads up!"
      description="Make sure the name on the account matches the name on your profile."
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: true }"
    />
    <form class="flex flex-col gap-4 w-full" @submit.prevent="submit">
      <UInput class="" size="lg" type="text" placeholder="Enter account number" v-model="data.accountNumber" />
      <USelectMenu 
      class="" 
      size="lg" 
      v-model="data.bankCode" 
      :options="banks" 
      searchable
      searchable-placeholder="Search a bank..."
      :search-attributes="['name', 'slug']"
      value-attribute="code"
      option-attribute="name"
      placeholder="Select bank" 
      />
      
      <UButton :loading="loading" class="bg-secondary-900 w-fit"type="submit">Add account</UButton>
    </form>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";

const toast = useToast();
const userStore = useUserStore();
const emit = defineEmits(['close-modal'])

const alertShowing = ref(true);
const loading = ref(false)

const banks = ref([])

const data = reactive({
  accountNumber: '',
  bankCode: '',
  bankName: ''
});

onMounted(async () => {
  const { data } = await $fetch('https://api.paystack.co/bank', {
    headers: {
      Authorization: 'Bearer '+useRuntimeConfig().paystackSecretKey,
      'Content-Type': 'application/json'
    },
    query: {
      country: 'nigeria',
      currency: 'NGN'
    }
  })

  banks.value = data
})

async function submit() {
  loading.value = true
  const errors = validate();

  if (errors.length > 0) {
    toast.add({title: 'Could not add account', description: errors.join("\n"), color: 'red'})
    return;
  }

  const selectedBank = banks.value.find(bank => bank.code === data.bankCode);

  // If a matching bank is found, set the bankName
  if (selectedBank) {
    data.bankName = selectedBank.name;
  }

  await $fetch('/api/create/withdrawalAccount', {
    method: "POST",
    body: { 
      uid: userStore.getUser.uid,
      number: data.accountNumber,
      bankCode: data.bankCode,
      bankName: data.bankName
    }
  })
  .then(() => {
    emit('close-modal')
    toast.add({title: 'Account added successfully', description: 'Reload the page to see changes.'})
  })
  .catch((e) => {
    console.log(e.message)
    toast.add({title: 'An error occurred', description: 'Check inputs and try again', color: 'red'})
  }).finally(() => {
    loading.value = false
  });
}

function validate() {
  let errors = [];

  // Check if accountNumber is exactly 10 digits
  const accountNumberPattern = /^\d{10}$/;
  if (!accountNumberPattern.test(data.accountNumber)) {
    errors.push("Invalid account number - It should be exactly 10 digits.");
  }

  // Check if bankCode is not empty
  if (!data.bankCode) {
    errors.push("Bank is required.");
  }

  return errors;
}

function closeAlert() {
  alertShowing.value = false
}
</script>

<style lang="scss" scoped>

</style>