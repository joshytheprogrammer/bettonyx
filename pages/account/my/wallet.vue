<template>
  <div class="block space-y-4 lg:space-y-0 lg:flex gap-4 lg:max-w-[80%] mx-auto px-4 sm:px-8 md:px-8 lg:px-18 my-8">
    <AccountNav />
    <div class="flex flex-col items-start justify-start gap-4 shadow-md rounded-md w-full md:border px-2 md:px-4 py-4">
      <AccountWallet />
      <AccountWalletDeposit v-if="action === 'deposit'" />
      <AccountWalletWithdraw v-else-if="action === 'withdraw'"  />
      <AccountWalletTransactions v-else />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
});

const route = useRoute();
const action = computed(() => route.query.action);
</script>

<style lang="scss" scoped>

</style>