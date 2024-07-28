<template>
  <div class="block space-y-4 md:space-y-8">
    <h1 class="md:text-2xl text-lg font-medium leading-9 tracking-tight mb-2">Your issues</h1>
    
    <!-- Search Input -->
    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="Search issues" 
      class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
    />
    
    <!-- Filter Buttons -->
    <div class="flex space-x-4 my-4">
      <button 
        @click="filterStatus('open')" 
        :class="{'bg-primary-800 text-white': currentFilter === 'open'}" 
        class="px-4 py-2 border rounded-md"
      >
        Open
      </button>
      <button 
        @click="filterStatus('closed')" 
        :class="{'bg-primary-800 text-white': currentFilter === 'closed'}" 
        class="px-4 py-2 border rounded-md"
      >
        Closed
      </button>
      <button 
        @click="filterStatus('all')" 
        :class="{'bg-primary-800 text-white': currentFilter === 'all'}" 
        class="px-4 py-2 border rounded-md"
      >
        All
      </button>
    </div>

    <div class="space-y-4 pb-4 md:h-96 md:overflow-auto">
      <p v-if="loading">Loading...</p>
      <p v-else-if="error">An error occurred</p>
      
      <UCard class="my-4 mx-0 md:mx-2" v-for="item in filteredIssues" :key="item.id">
        <template #header>
          <h2 
            @click="router.push('?issue_id='+item.id)" 
            class="font-medium cursor-pointer leading-10 text-sm md:text-base hover:text-primary-800 dark:hover:text-primary-400 w-fit"
          >
            {{ item.title }}
          </h2>
        </template>

        <template #footer>
          <div class="flex justify-between text-xs md:text-sm">
            <p>Opened on {{
              new Date(item.createdAt.toDate()).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})
            }}</p>
            <UBadge v-if="item.status === 'open'" color="primary" label="open" />
            <UBadge v-if="item.status === 'closed'" color="red" label="closed" />
          </div>
        </template>
      </UCard>
      
      <p v-if="!loading && filteredIssues.length === 0">No issues created. Thank God.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useUserStore } from "@/store/user";
import { useRouter } from 'vue-router';
import { useFirestore } from 'vuefire';

const db = useFirestore();
const userStore = useUserStore();
const router = useRouter();

const uid = userStore.getUser.uid;
const issues = ref([]);
const loading = ref(true);
const error = ref(false);
const searchQuery = ref('');
const currentFilter = ref('all');

const filterStatus = (status) => {
  currentFilter.value = status;
};

const filteredIssues = computed(() => {
  return issues.value
    .filter(issue => {
      if (currentFilter.value === 'all') return true;
      return issue.status === currentFilter.value;
    })
    .filter(issue => issue.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate()));
});

onMounted(async () => {
  const unsubscribe =onSnapshot(
    query(
      collection(db, 'issues'),
      where('userID', '==', uid)
    ),
     (snapshot) => {
      const newIssues = []; // Temporary array to store the fetched issues

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          newIssues.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Remove duplicates based on the 'id' field
        issues.value = newIssues
          .filter((issue, index, self) =>
            index === self.findIndex((t) => t.id === issue.id)
          );
      } else {
        issues.value = [];
      }

      loading.value = false; // Clear loading state after processing
    },
    (error) => {
      error.value = true;
      console.log(error);
      loading.value = false; // Clear loading state on error
    }
  );

  // Clean up the listener when the component unmounts
  onUnmounted(() => {
    unsubscribe();
  });
});
</script>

<style lang="scss" scoped>

</style>
