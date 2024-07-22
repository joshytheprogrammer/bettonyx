<template>
  <div >
    <NuxtLink @click.prevent="isAddAccountOpen = true" class="w-fit h-fit block py-4 underline cursor-pointer" >Create withdrawal account</NuxtLink>
    <UModal v-model="isAddAccountOpen">
      <div class="p-4">
        <h2 class="text-2xl pb-8 font-medium" >Account adding form</h2>
        <AccountHelpersAccountAddingForm @close-modal="isAddAccountOpen = false" />
      </div>
    </UModal>
  </div>
</template>

<script setup>
const isAddAccountOpen = ref(false);
</script>

