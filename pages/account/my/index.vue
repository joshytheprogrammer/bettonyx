<template>
  <div class="block space-y-4 lg:space-y-0 lg:flex gap-4 lg:max-w-[80%] mx-auto px-4 sm:px-8 md:px-8 lg:px-18 my-8">
    <AccountNav />
    <div class="w-full border border-slate-500 px-4 py-4">
      <AccountMy />
      <AccountMyWithdrawalAccounts />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
});
</script>

<style lang="scss" scoped>

</style>