<template>
  <div>
    <AuthLogin />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
});
</script>

<style lang="scss" scoped>

</style>