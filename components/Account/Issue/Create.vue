<template>
  <div class="block space-y-4 md:space-y-8">
    <h1 class="md:text-2xl text-lg font-medium leading-9 tracking-tight">Create new issue</h1>
    <UForm class="space-y-6" :state="issue" @submit="submitIssue">
      <UFormGroup :label="'Add a title - '+ issue.title.length + ' characters'" name="title">
        <UInput v-model="issue.title" placeholder="Title (Less that 100 characters)" />
      </UFormGroup>
      <UFormGroup label="Add a description">
        <ClientOnly>
          <HelpersTiptapEditor v-model="issue.description"  placeholder="Add your description here..."  />
          <template #fallback>
            <p class="text-xs md:text-sm" >Loading...</p>
          </template>
        </ClientOnly>

      </UFormGroup>
      
      <UButton type="submit" :loading="loading" class=" text-xs rounded-md md:text-sm px-4 py-2 md:p-2 bg-primary-700 text-white dark:text-white dark:bg-primary-800 hover:bg-primary-700">Submit</UButton> 
    </UForm>

  </div>
</template>

<script setup>
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useUserStore } from "@/store/user";

const {validate} = useCreateUtilities();

const db = useFirestore();
const toast = useToast();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const uid = userStore.getUser.uid;
const issue = reactive({
  title: route.query.issue_title ? route.query.issue_title : '',
  description: route.query.issue_description ? route.query.issue_description : 'Describe your issue here...',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  resolvedAt: null,
  status: 'open', // or close
  userID: uid
});

let loading = ref(false);

async function submitIssue() {
  loading.value = true;

  if(issue.description === 'Describe your issue here...' || issue.description === '<p></p>' || issue.title === ''){
    toast.add({title: 'Invalid issue submitted', color: 'red'});
    loading.value = false; 
    return
  }

  if(issue.title.length > 99) {
    toast.add({title: 'Issue title must be less than 100 characters..', color: 'red'})
    loading.value = false; 
    return
  }

  await addDoc(collection(db, 'issues'), issue)
    .then(() => {
      toast.add({ title: 'Issue Submitted', description: 'Support will reach out to you shortly' });
      Object.assign(issue, {title: '', description: ''});
    })
    .catch((error) => {
      console.error({ code: error.code, message: error.message });
      toast.add({ title: 'An error occurred!!!' });
    })
    .finally(() => {
      loading.value = false;
      router.push('/account/my/support?')
    });
}
</script>
