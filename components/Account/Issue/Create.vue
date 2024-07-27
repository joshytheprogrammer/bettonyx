<template>
  <div class="block space-y-8">
    <h1 class="md:text-2xl text-lg font-medium leading-9 tracking-tight">Create new issue</h1>
    <UForm class="space-y-6" :state="issue">
      <UFormGroup label="Add a title" name="title">
        <UInput  placeholder="Title" />
      </UFormGroup>
      <UFormGroup label="Add a description" name="description">
        <ClientOnly>
          <HelpersTiptapEditor v-model="issue.description"  placeholder="Add your description here..."  />
          <template #fallback>
            <p class="text-xs md:text-sm" >Loading...</p>
          </template>
        </ClientOnly>

      </UFormGroup>
      
      <UButton type="submit" :loading="loading" class=" text-xs rounded-md md:text-sm px-4 py-2 md:p-2 bg-primary-700 text-white dark:text-white dark:bg-primary-800 hover:bg-primary-700">Update</UButton> 
    </UForm>

  </div>
</template>

<script setup>
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useUserStore } from "@/store/user";


const db = useFirestore();
const toast = useToast();
const userStore = useUserStore();

const uid = userStore.getUser.uid;
const issue = reactive({
  title: '',
  description: 'Describe your issue here...',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  resolvedAt: null,
  status: 'open', // or close
  userID: uid
});

let loading = ref(false);

async function submitIssue() {
  loading.value = true;

  if(issue.description === 'Describe your issue here...'){toast.add({title: 'Invalid description'}); return}

  await addDoc(collection(db, 'issues'), issue)
    .then(() => {
      toast.add({ title: 'Issues Created', description: 'Support will reach out shortly' });
      Object.assign(issue, {title: '', description: ''});
    })
    .catch((error) => {
      console.error({ code: error.code, message: error.message });
      toast.add({ title: 'An error occurred!!!' });
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<!-- 
<style scoped>
/* List styles */
ul,
ol {
  padding: 0 1rem;
  margin: 1.25rem 1rem 1.25rem 0.4rem;
}

ul li p,
ol li p {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

/* Heading styles */
h1,
h2,
h3,
h4,
h5,
h6 {
  line-height: 1.1;
  margin-top: 2.5rem;
  text-wrap: pretty;
}

h1,
h2 {
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 1.4rem;
}

h2 {
  font-size: 1.2rem;
}

h3 {
  font-size: 1.1rem;
}

h4,
h5,
h6 {
  font-size: 1rem;
}

/* Code and preformatted text styles */
code {
  background-color: var(--purple-light);
  border-radius: 0.4rem;
  color: var(--black);
  font-size: 0.85rem;
  padding: 0.25em 0.3em;
}

pre {
  background: var(--black);
  border-radius: 0.5rem;
  color: var(--white);
  font-family: 'JetBrainsMono', monospace;
  margin: 1.5rem 0;
  padding: 0.75rem 1rem;
}

pre code {
  background: none;
  color: inherit;
  font-size: 0.8rem;
  padding: 0;
}

/* Blockquote styles */
blockquote {
  border-left: 3px solid var(--gray-3);
  margin: 1.5rem 0;
  padding-left: 1rem;
}

/* Horizontal rule styles */
hr {
  border: none;
  border-top: 1px solid var(--gray-2);
  margin: 2rem 0;
}

</style> -->
