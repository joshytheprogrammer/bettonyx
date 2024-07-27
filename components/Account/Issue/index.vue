<template>
  <div>
    {{ route.query.issue }}
    <NuxtLink to="/account/my/support" >Back</NuxtLink>
  </div>
</template>

<script setup>
const route = useRoute();
</script>

<style lang="scss" scoped>

</style>