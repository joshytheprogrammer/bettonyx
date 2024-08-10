<template>
  <div class="flex flex-col items-start justify-start md:gap-4 gap-6">
    <h2 class="text-base md:text-2xl font-medium underline decoration-primary-900 dark:decoration-primary-600 underline-offset-8	decoration-2 text-gray-900 dark:text-gray-200">Your Profile</h2>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">An error occurred</p>
    <form v-else class="md:space-y-4 space-y-6" @submit.prevent="update">
      <div class="space-y-4 md:space-y-0 md:grid grid-cols-2 items-center gap-4">
        <div>
          <label class="block text-xs md:text-sm font-medium leading-6 ">First Name</label>
          <div class="inline-flex items-center">
            <input 
            type="text" 
            autocomplete="firstName"
            required
            :disabled="disabledFields.firstName"
            v-model="user.firstName"

            class="block w-full rounded-tl-md rounded-bl-md  border-0 py-1.5 pl-1.5 pr-20 text-black dark:text-white shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 text-xs sm:text-sm sm:leading-6 disabled:cursor-not-allowed" />
            <button type="button" class="py-1.5 px-2 bg-primary-700 text-white dark:bg-primary-800  rounded-tr-md rounded-br-md text-base" @click="enableField('firstName')" >
              <UIcon name="i-carbon-edit"  />
            </button>
          </div>
        </div>
        <div >
          <label class="block text-xs sm:text-sm font-medium leading-6 ">Last Name</label>
          <div class="inline-flex items-center" >
            <input 
            type="text" 
            autocomplete="lastName"
            required
            :disabled="disabledFields.lastName"
            v-model="user.lastName"
            
            class="block w-full rounded-tl-md rounded-bl-md  border-0 py-1.5 pl-1.5 pr-20 text-black dark:text-white shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 text-xs sm:text-sm sm:leading-6 disabled:cursor-not-allowed" />
            <button type="button" class="py-1.5 px-2 bg-primary-700 text-white dark:bg-primary-800  rounded-tr-md rounded-br-md text-base" @click="enableField('lastName')" >
              <UIcon name="i-carbon-edit" />
            </button>
          </div>
        </div>
        <div>
          <label class="block text-xs sm:text-sm font-medium leading-6 ">Email</label>
          <input 
            type="text" 
            autocomplete="email"
            required
            :disabled="true"
            v-model="user.email"
            
            class="block w-full rounded-md border-0 py-1.5 pl-1.5 pr-20 text-black dark:text-white shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 text-xs sm:text-sm sm:leading-6 disabled:cursor-not-allowed" />
        </div>
        <div>
          <label class="block text-xs sm:text-sm font-medium leading-6 ">Phone</label>
          <input 
            type="text" 
            autocomplete="phone"
            required
            :disabled="true"
            v-model="user.phone"
            
            class="block w-full rounded-md border-0 py-1.5 pl-1.5 pr-20 text-black dark:text-white shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 text-xs sm:text-sm sm:leading-6 disabled:cursor-not-allowed" />
        </div>
      </div>
      <button type="submit" class="text-xs rounded-md md:text-sm p-4 md:p-2 bg-primary-700 text-white dark:bg-primary-800 ">Update</button>
    </form>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const db = useFirestore();
const userStore = useUserStore();
const toast = useToast();

const loading = ref(true);
const error = ref(false);

let user = reactive({});
let originalUser = {};

let disabledFields = reactive({
  firstName: true,
  lastName: true
});

const uid = userStore.getUser.uid;

await getDoc(doc(db, 'users', uid))
.then((doc) => {
  const { role, createdAt, ...rest } = doc.data();
  user = {id: doc.id, ...rest}
  originalUser = { ...user };
})
.catch((e) => {
  error.value = true
  console.log(e)
}).finally(() => {
  loading.value = false
});

onMounted(async () => {
  await userStore.setUserData({email: user.email, phone: user.phone, status: user.status})
})

function enableField(field) {
  if(field == 'lastName'){
    disabledFields.lastName = false
  }else if(field == 'firstName'){
    disabledFields.firstName = false
  }
}

async function update() {
  if (user.firstName === originalUser.firstName && user.lastName === originalUser.lastName) {
    toast.add({ title: 'No changes made' });
    return;
  }

  loading.value = true
  
  await updateDoc(doc(db, "users", uid), {
    firstName: user.firstName,
    lastName: user.lastName
  })
  .then(() => {
    originalUser = { ...user };
    toast.add({ title: 'Profile Updated' })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error({code: errorCode, message: errorMessage})
    toast.add({ title: 'An error occurred.', description: errorCode })
  }).finally(() => {
    disableFields();
    loading.value = false;
  });

}

function disableFields() {
  disabledFields.firstName = true;
  disabledFields.lastName = true;
}
</script>

<style lang="scss" scoped>

</style>