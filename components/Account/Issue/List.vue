<template>
  <div class="block space-y-4 md:space-y-8">
    <h1 class="md:text-2xl text-lg font-medium leading-9 tracking-tight mb-2 " >Your issues</h1>
    <div class="space-y-4 pb-4 md:h-96 md:overflow-auto">
      <p v-if="loading">Loading...</p>
      <p v-else-if="error">An error occurred</p>
      <UCard class="my-4 mx-0 md:mx-2" v-for="item in issues" :key="item.id" >
        <template #header>
          <h2 @click="router.push('?issue='+item.id)" class="font-medium cursor-pointer leading-10 text-sm md:text-base hover:text-primary-800 dark:hover:text-primary-400 w-fit"> {{ item.title }} </h2>
        </template>

        <template #footer>
          <div class="flex justify-between text-xs md:text-sm">
            <p>Opened on {{
              new Date(item.createdAt.toDate()).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}}
              </p>
            <UBadge v-if="item.status === 'open'" color="primary" label="open" />
            <UBadge  v-if="item.status === 'closed'" color="red" label="closed" />
          </div>
        </template>
      </UCard>
      <p v-if="!loading && issues.length===0">No issues created. Thank God.</p>
    </div>
  </div>
</template>

<script setup>
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useUserStore } from "@/store/user";

const db = useFirestore();
const userStore = useUserStore();
const router = useRouter();

const uid = userStore.getUser.uid;
const issues = ref([])

const loading = ref(true);
const error = ref(false);

await fetchIssues();

async function fetchIssues() {
  try {
    const issuesSnapshot = await getDocs(
      query(
        collection(db, 'issues'), 
        where('userID', '==', uid),
      )
    );

    if (issuesSnapshot.empty) {
    } else {
      issuesSnapshot.forEach((doc) => {
        issues.value.push({
          id: doc.id,
          ...doc.data()
        });
      });

      issues.value.sort((a, b) => new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate()));

    }
  } catch (e) {
    error.value = true;
    console.log(e)
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>

</style>