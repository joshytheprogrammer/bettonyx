<template>
  <div class="lg:max-w-[80%] mx-auto px-4 sm:px-8 md:px-8 lg:px-18 my-12 leading-10 ">
    <h2 class="text-lg md:text-2xl font-bold mb-8 capitalize">Who will win - {{ event.name }}</h2>
    <div class="flex flex-col lg:grid grid-cols-2 gap-12 items-start">
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white dark:bg-black border border-gray-200 text-xs sm:text-sm md:text-base leading-8">
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
              <td class="py-2 px-4 border-b border-gray-200">{{ parseFloat(team.odds).toFixed(2) }}</td>
              <td class="py-2 px-4 border-b border-gray-200">
                <button v-if="selectedTeam.id !== team.id" @click="selectTeam(team)" class="bg-primary-600 text-white py-1 px-3 rounded">Choose Team</button>
                <button v-else class="bg-primary-800 opacity-60 text-white py-1 px-3 rounded cursor-not-allowed">Chosen</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-sm md:text-base flex flex-col gap-8">
        <p class="">Starts: 
          <span class="block pt-4 font-semibold">
            {{ new Date(event.startDate).toLocaleString('en-US', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) }} by {{ event.startTime }}
          </span>
        </p>
        <p >Description: <span class="block pt-4 font-medium">{{ event.description }}</span></p>
        <!-- <pre class="mt-4">{{ event }}</pre> -->
      </div>
      <div class="border shadow-md rounded-md w-full py-4 px-2 space-y-4" v-if="selectedTeam.id">
        <h2 class="text-lg md:text-2xl pb-8 underline underline-offset-[16px] decoration-primary-500">Events Slip</h2>
        <div class="flex gap-4 md:gap-2 items-center font-semibold">
          <p class="w-fit bg-primary-500 dark:bg-primary-600 text-white rounded-md p-3 text-sm" >{{ parseFloat(selectedTeam.odds).toFixed(2) }}x</p>
          <p class="text-base md:text-lg" >{{ selectedTeam.name }}</p>
        </div>
        <div class="flex flex-col gap-2 py-4">
          <div class="w-full">
            <input type="text" class="w-full rounded-md border-2 border-primary-300 p-1.5 shadow-sm outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary-800 sm:text-sm sm:leading-6 bg-gray-200 dark:bg-transparent focus:bg-transparent" placeholder="Stake Amount" v-model="amount" />
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
          <NuxtLink v-if="!userStore.isAuthenticated" to="/login" class="block bg-primary-800 text-center w-full rounded-md text-white py-2 text-sm">Sign in to Place Bet</NuxtLink>
          <UButton v-else :loading="loading" :disabled="loading" class="bg-primary-800 flex items-center justify-center hover:bg-primary-900 text-center w-full rounded-md text-white py-4 md:py-2 text-sm" @click="placeEventBet">Place Event Bet</UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { doc, getDoc } from 'firebase/firestore';
import { useUserStore } from "@/store/user";

const route = useRoute();
const userStore = useUserStore();
const toast = useToast();

const db = useFirestore();
const event = reactive({});
const loading = ref(false);

let selectedTeam = reactive({});
const amount = ref('');
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

await fetchEventData();

async function placeEventBet() {
  loading.value = true;

  try {
    if (amount.value < 100) {
      toast.error('Amount must be at least 100');
      return;
    }

    if (amount.value > userStore.getBalance) {
      toast.error('Insufficient Funds. Fund your account.');
      return;
    }

    const response = await $fetch('/api/create/bet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: userStore.getUser.uid,
        eventID: event.id,
        betType: 'event',
        teamBetOn: selectedTeam.id,
        betAmount: amount.value,
        oddsAtBetTime: selectedTeam.odds,
      }),
    });

    if (response.status === 200) {
      toast.add({'title': 'Bet Placed. Good Luck. Check your bet history for more details.'});
      selectedTeam = {}
    } else {
      toast.add({title: 'Failed to place bet. Check your bet history and balance.', color: 'red'});
    }
  } catch (error) {
    console.error('An error occurred:', error);
    toast.add({title: 'An error occurred while placing the bet.', color: 'red'});
  } finally {
    loading.value = false;
  }
}

function selectTeam(team) {
  Object.assign(selectedTeam, team);
}
</script>
