<template>
  <div class="lg:max-w-[80%] mx-auto px-4 sm:px-8 md:px-8 lg:px-18 my-8">
    <h2 class="text-base md:text-2xl font-bold mb-8">Who will win - {{ event.name }}</h2>
    <div class="flex flex-col lg:grid grid-cols-2 gap-12 items-start">
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white dark:bg-black border border-gray-200 text-sm md:text-base ">
          <thead>
            <tr class="bg-gray-200 dark:bg-gray-600">
              <th class="py-2 px-4 text-left">Team</th>
              <th class="py-2 px-4 text-left">Odds</th>
              <th class="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, index) in event.teams" :key="index">
              <td class="py-2 px-4 border-b border-gray-200 uppercase">{{ team.name }}</td>
              <td class="py-2 px-4 border-b border-gray-200">{{ team.odds }}</td>
              <td class="py-2 px-4 border-b border-gray-200">
                <button v-if="selectedTeam.id !== team.id" @click="selectTeam(team)" class="bg-secondary-600 text-white py-1 px-3 rounded">Choose Team</button>
                <button v-else class="bg-secondary-800 opacity-60 text-white py-1 px-3 rounded cursor-not-allowed">Chosen</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-sm md:text-base flex flex-col gap-4">
        <p class="">Starts: <span class="block font-semibold">{{ event.startDate }} at {{ event.startTime }}</span></p>
        <p class="mt-2">Description: <span class="block text-xs md:text-base font-medium">{{ event.description }}</span></p>
        <div class="border py-4 px-2" v-if="selectedTeam.id">
          <h2 class="text-2xl pb-6 underline underline-offset-[12px] decoration-secondary-500">Event Slip</h2>
          <div class="flex gap-2 items-center font-semibold">
            <p class="w-fit bg-gray-400 dark:bg-gray-500 dark:text-white rounded-md p-3 text-sm" >{{ selectedTeam.odds }}x</p>
            <p class="text-base md:text-lg" >{{ selectedTeam.name }}</p>
          </div>
          <div class="flex flex-col gap-3 py-4">
            <div class="w-full">
              <input type="text" class="w-full rounded-md border-0 p-1.5 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-secondary-800 sm:text-sm sm:leading-6 bg-gray-200 dark:bg-transparent focus:bg-transparent" placeholder="Stake Amount" v-model="amount" />
            </div>
            <div class="flex justify-between">
              <span>Amount</span>
              <span>
                {{ 
                  new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(amount) 
                }}
              </span>
            </div>
            <div class="flex justify-between">
              <span>Odds</span>
              <span>{{ selectedTeam.odds }}</span>
            </div>
            <div class="flex justify-between">
              <span>Potential Win</span>
              <span>
                {{ 
                  new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(potentialPayout) 
                }}
              </span>
            </div>
          </div>
          <div class="py-4">
            <NuxtLink v-if="!userStore.isAuthenticated" to="/login" class="block bg-secondary-800 text-center w-full rounded-md text-white py-2 text-sm">Sign in to Place Bet</NuxtLink>
            <UButton v-else :loading="loading" :disabled="loading" class="bg-secondary-800 flex items-center justify-center hover:bg-secondary-900 text-center w-full rounded-md text-white py-2 text-sm" @click="placeEventBet">Place Bet</UButton>
          </div>
        </div>
        <!-- <pre class="mt-4">{{ event }}</pre> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { doc, getDoc } from 'firebase/firestore';
import { useUserStore } from "@/store/user";

const route = useRoute();
const userStore = useUserStore();

const db = useFirestore();
const event = reactive({});
const loading = ref(false);

const selectedTeam = reactive({});
const amount = ref(0);
const potentialPayout = computed(() => parseFloat(amount.value) * parseFloat(selectedTeam.odds));

const id = route.params.id;

async function fetchEventData() {
  try {
    loading.value = true;
    const docSnap = await getDoc(doc(db, 'events', id));
    if (docSnap.exists()) {
      Object.assign(event, { id: docSnap.id, ...docSnap.data() });
    } else {
      console.error("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
  } finally {
    loading.value = false;
  }
}

fetchEventData();

async function placeEventBet() {
  // Implementation of the placeEventBet function
}

function selectTeam(team) {
  Object.assign(selectedTeam, team);
}
</script>
