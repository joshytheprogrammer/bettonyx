<template>
  <div>
    <h1>Create new issue</h1>
    <UForm  class="space-y-3">
      <UFormGroup label="Full name" name="fullName">
        <UInput  placeholder="Management Information Systems FC" />
      </UFormGroup>
      <UFormGroup label="Short name" name="shortName">
        <UInput  placeholder="MIS" />
      </UFormGroup>
      
    <UButton  type="submit" color="black">
      Submit
    </UButton>
  </UForm>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>