<template>
  <div>
    <!-- <h1 class="md:text-2xl text-lg font-medium leading-9 tracking-tight mb-2">Comments</h1> -->
    <div ref="commentsContainer" class="flex-grow overflow-auto space-y-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md max-h-96">
      <div v-if="comments.length > 0" v-for="(group, date) in groupedComments" :key="date">
        <p class="text-xs md:text-sm font-medium my-4 mx-auto text-white px-2 py-1 rounded-md w-fit bg-gray-600">{{ date }}</p>
        <div v-for="comment in group" :key="comment.id" class="flex flex-col mb-4">
          <div :class="[
            'p-2 rounded-md max-w-xs',
            comment.isAdmin ? 'bg-primary-950 text-white self-start ' : 'bg-primary-800 text-white self-end'
          ]">
            <p class="text-xs md:text-sm">{{ comment.comment }}</p>
            <p class="text-right text-xs mt-1">{{ new Date(comment.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
          </div>
        </div>
      </div>
      <p v-else class="text-xs md:text-sm font-medium my-4 mx-auto text-white px-2 py-1 rounded-md w-fit bg-gray-600">No comments yet</p>
    </div>
    <form class="flex text-xs md:text-sm mt-4" @submit.prevent="addComment" v-if="routeStatus === 'open' && !loading"  >
      <input 
        type="text" 
        v-model="comment" 
        placeholder="Add comment" 
        class="w-full p-1.5 border focus:border-none rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-600"
      />
      <button type="submit"class="w-fit px-4 py-1.5 ring-1 rounded-r-md bg-primary-800 text-white">Send</button>
    </form>
  </div>
</template>

<script setup>
import { collection, query, where, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { useUserStore } from "@/store/user";

const db = useFirestore();
const userStore = useUserStore();
const router = useRouter();

const uid = userStore.getUser.uid;
const route = useRoute();

const loading = ref(true);
const error = ref(false);

const id = route.query.issue_id;
const routeStatus = route.query.status
const comment = ref('');
const comments = ref([]);
const commentsContainer = ref(null);

const unsubscribe = onSnapshot(
  query(
    collection(db, 'issue_comments'),
    where('issue_id', '==', id)
  ),
  (snapshot) => {
    const newComments = [];
    snapshot.forEach((doc) => {
      newComments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    comments.value = newComments.sort((a, b) => a.createdAt.toDate() - b.createdAt.toDate());
    loading.value = false;
  },
  (error) => {
    error.value = true;
    console.log(error);
    loading.value = false;
  }
);

// Clean up the listener when the component unmounts
onUnmounted(() => {
  unsubscribe();
});


async function addComment() {
  loading.value = true;

  if(comment.value.length === 0) {
    loading.value = false;
    return;
  }


  await addDoc(collection(db, 'issue_comments'), {
    issue_id: id,
    comment: comment.value,
    isAdmin: false,
    createdAt: Timestamp.now()
  })
  .then(() => {
    nextTick(() => scrollToBottom());
  })
  .catch((error) => {
    console.error({ code: error.code, message: error.message });
  })
  .finally(() => {
    loading.value = false;
    comment.value = '';
  });
}

function groupCommentsByDate(comments) {
  return comments.reduce((acc, comment) => {
    const date = new Date(comment.createdAt.toDate()).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(comment);
    return acc;
  }, {});
}

function scrollToBottom() {
  if (commentsContainer.value) {
    commentsContainer.value.scrollTop = commentsContainer.value.scrollHeight;
  }
}

const groupedComments = computed(() => groupCommentsByDate(comments.value));
</script>


