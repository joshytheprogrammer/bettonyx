<template>
  <div class="block space-y-4">
    <h1 class="md:text-2xl text-lg font-medium leading-9 tracking-tight mb-2">Create new issue</h1>
    <UForm class="space-y-6">
      <UFormGroup label="Add a title" name="title">
        <UInput  placeholder="Title" />
      </UFormGroup>
      <UFormGroup label="Add a description" name="shortName">
        <UTextarea placeholder="Add your description here..." />
      </UFormGroup>
      
      <UButton type="submit" class="text-xs rounded-md md:text-sm px-4 py-2 md:p-2 bg-primary-700 text-white dark:text-white dark:bg-primary-800 hover:bg-primary-700">Update</UButton> 
    </UForm>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>