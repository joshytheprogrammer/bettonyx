<template>
  <div class="lg:max-w-[80%] mx-auto px-4 sm:px-8 md:px-8 lg:px-18 my-8 ">
    {{ event }}
  </div>
</template>

<script setup>
const route = useRoute();

import { doc, getDoc } from 'firebase/firestore';

const db = useFirestore();
const event = reactive({})
const loading = ref(false);

const id = route.params.id;

try {
  loading.value = true;
  await getDoc(doc(db, 'events', id)).then((doc) => {
    event.value = {id: doc.id, ...doc.data()};
  }).catch((e)=>{
    console.log(e)
  }).finally(() => {
    loading.value = false
  });
} catch(e) {
  
} finally {
  loading.value = false;
}

</script>

<style lang="scss" scoped>

</style>