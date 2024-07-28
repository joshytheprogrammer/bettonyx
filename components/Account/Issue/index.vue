<template>
  <div class="space-y-6" >
    <div class="block space-y-4" >
      <h1 class="text-lg md:text-3xl font-medium mb-8" >{{ issue.title }}</h1>
      <div class="prose-sm" v-html="issue.description"></div>
      <div class="flex justify-between flex-wrap text-xs md:text-sm">
        <div class="">
          <UBadge v-if="issue.status === 'open'" color="primary" label="open" />
          <UBadge  v-if="issue.status === 'closed'" color="red" label="closed" />
        </div>
        <p>Opened on {{
          new Date(issue.createdAt.toDate()).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'})}}
        </p>
      </div>
    </div>
    <div class="flex justify-between flex-wrap w-full">
      <button class=" bg-primary-950 text-center rounded-md text-white py-2 px-4 text-sm" @click="$router.push('/account/my/support')" >Back to list</button>
      <button v-if="issue.status === 'open'"class=" bg-primary-800 text-center rounded-md text-white py-2 px-4 text-sm" :disabled="loading" @click="markAsResolved" >{{ loading ? 'loading...' : 'Mark as resolved' }}</button>
    </div>
    
  </div>
</template>

<script setup>
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { useUserStore } from "@/store/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const toast = useToast();
const db = useFirestore();

const id = route.query.issue_id;
const issue = reactive({});

const loading = ref(false)

async function fetchIssueData() {
  try {
    loading.value = true;
    const docSnap = await getDoc(doc(db, 'issues', id));
    if (docSnap.exists()) {
      Object.assign(issue, { id: docSnap.id, ...docSnap.data() });
    } else {
      console.error("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
  } finally {
    loading.value = false;
  }
}

await fetchIssueData();


async function markAsResolved() {
  loading.value = true;

  await updateDoc(doc(db, 'issues', issue.id), {
    resolvedAt: Timestamp.now(),
    status: 'closed'
  })
  .then(() => {
    toast.add({ title: 'Issue Closed' });
    router.push('/account/my/support')
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error({code: errorCode, message: errorMessage})
    toast.add({ title: 'An error occurred!!!' })
  }).finally(() => {
    loading.value = false;
  });
}
</script>

<style lang="scss" scoped>

</style>