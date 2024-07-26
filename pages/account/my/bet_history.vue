<template>
  <div class="block space-y-4 lg:space-y-0 lg:flex gap-4 lg:max-w-[80%] mx-auto px-4 sm:px-8 md:px-8 lg:px-18 my-8">
    <AccountNav />
    <div class="block md:grid grid-cols-4 items-start justify-start gap-4 border shadow-md rounded-md w-full px-4 py-4">
      <AccountHistory class="col-span-1" />
      <AccountHistoryData class="col-span-3" />
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  middleware: ['auth']
});

const route = useRoute();
</script>

<style lang="scss" scoped>

</style>