<template>
  <div class="border shadow-md rounded-md w-full">
    <h2 class="font-normal text-2xl py-4 px-2">Events</h2>
    <p v-if="loading">Loading...</p>
    <div class="flex flex-col text-base" v-if="events">
      <div v-for="item in events" @click="router.push('/events/'+item.id)" class="cursor-pointer hover:bg-primary-900 hover:text-white w-full px-2 py-4" >
        <span class="text-sm md:text-base uppercase" >{{ item.name }}</span>
      </div>
    </div>
    <div class="py-4 px-2" v-if="events.length == 0">
      <p>No events available</p>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

import { collection, query, where, getDocs } from 'firebase/firestore';

const db = useFirestore();
const events = ref([]);
const loading = ref(false);

try {
  loading.value = true;
  const eventsSnapshot = await getDocs(
    query(
      collection(db, 'events'), 
      where('status', '==', 'upcoming')
    )
  );

  if (eventsSnapshot.empty) {
  } else {
    eventsSnapshot.forEach((doc) => {
      events.value.push({id:doc.id, name: doc.data().name});
    });
  }
} catch (e) {
  console.log(e)
} finally {
  loading.value = false;
}
</script>

<style lang="scss" scoped>

</style>