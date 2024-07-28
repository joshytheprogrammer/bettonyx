<template>
  <div class="block space-y-4 lg:space-y-0 lg:flex gap-4 lg:max-w-[80%] mx-auto px-4 sm:px-8 md:px-8 lg:px-18 my-8">
    <AccountNav />
    <div class="block space-y-4 lg:grid grid-cols-2 items-start justify-start gap-6 shadow-md rounded-md w-full md:border  md:px-4 py-4">
      <div class="">
        <AccountIssue v-if="route.query.issue_id" />
        <AccountIssueList v-else />
      </div>
      <div class="">
        <AccountIssueComments v-if="route.query.issue_id" />
        <AccountIssueCreate v-else />
      </div>
      
      
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