<template>
  <div class="border py-1 shadow-md rounded-md w-full">
    <h2 class="font-normal text-2xl py-4 px-2">Events</h2>
    <p v-if="loading">Loading...</p>
    <div class="flex flex-col text-base" v-if="events">
      <div v-for="item in events" @click="router.push('/events/'+item.id)" class="flex justify-between items-center cursor-pointer hover:bg-primary-700 hover:text-white w-full px-2 py-4" >
        <span class="text-sm md:text-base uppercase underline underline-offset-4" >{{ item.name }}</span>
        <span class="w-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg>
        </span>
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