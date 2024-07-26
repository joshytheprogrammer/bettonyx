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
      
    <UButton type="submit" color="black">
      Submit
    </UButton>
  </UForm>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>