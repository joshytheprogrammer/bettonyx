<template>
  <div class="border px-2">
    <h2 class="font-medium text-2xl py-4">Covenant Upcoming</h2>
    <p class="" v-if="loading">Loading...</p>
    <div v-if="matches">
      <!-- {{ matches }} -->
      <div v-for="(dayMatches, date) in groupedMatches" :key="date" class="py-2">
        <div class="flex justify-between py-1 px-2">
          <h3 class="font-normal text-lg">
            {{
              new Date(date).toLocaleString('en-US', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
            }}
          </h3>
          <div class="flex space-x-[2px] text-center text-gray-600 dark:text-gray-200">
            <span class="w-14">win</span>
            <span class="w-14">tie</span>
            <span class="w-14">lose</span>
          </div>
        </div>
        <div v-for="match in dayMatches" :key="match.id" class="flex justify-between items-center py-4 px-2 border-t">
          <!-- {{ match }} -->
          <div>{{ match.startTime }}</div>
          <div class="uppercase flex flex-col items-center gap-1 " >
            <span>{{ reverseEngineerID(match.teamA.id) }} </span>
            <span class="text-xs">x</span>
            <span>{{ reverseEngineerID(match.teamB.id) }}</span>
          </div>
          <div class="flex space-x-[2px]">
            <button @click="addBet(match, 'teamA')" class="w-14 px-2 py-2 bg-secondary-800 hover:bg-secondary-900 text-white rounded-tl-md rounded-bl-md">{{ match.teamA.odds }}</button>
            <button @click="addBet(match, 'draw')" class="w-14 px-2 py-2 bg-secondary-800 hover:bg-secondary-900 text-white ">{{ match.drawOdds }}</button>
            <button @click="addBet(match, 'teamB')" class="w-14 px-2 py-2 bg-secondary-800 hover:bg-secondary-900 text-white rounded-tr-md rounded-br-md">{{ match.teamB.odds }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4" v-if="matches.length == 0">
      <p>No matches available</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import { useBetslipStore } from "@/store/betslip"

const betslipStore = useBetslipStore();
// const router = useRouter();
const db = useFirestore();
const matches = ref([]);
const loading = ref(false);

const groupByDate = (matches) => {
  return matches.reduce((acc, match) => {
    const date = match.startDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {});
};

const loadMatches = async () => {
  try {
    loading.value = true;
    const matchesSnapshot = await getDocs(
      query(collection(db, 'matches'), where('status', '==', 'upcoming'))
    );

    if (!matchesSnapshot.empty) {
      matchesSnapshot.forEach((doc) => {
        matches.value.push({ id: doc.id, ...doc.data() });
      });
    }

    groupedMatches.value = groupByDate(matches.value);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

const groupedMatches = ref({});

function reverseEngineerID(generatedID) {
  const namePart = generatedID.replace(/-[\da-f]+$/, "").split("-");

  const formattedName = namePart.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return formattedName;
}
  
function addBet(match, teamBetOn) {
  // betslipStore
  const bet = {
    match: {
      id: match.id,
      teamA: match.teamA,
      teamB: match.teamB,
      drawOdds: match.drawOdds
    },
    teamBetOn: teamBetOn
  }

  betslipStore.addBet(bet)
}

loadMatches();
</script>
