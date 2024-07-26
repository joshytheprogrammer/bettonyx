<template>
  <div class="w-full">
    <div class="flex flex-col gap-4 md:h-[400px] md:overflow-auto">
      <div class="m-1" v-for="item in combinedBets" :key="item.id">
        <p class="py-2">{{ formatDate(item.timestamp) }}</p>
        <div :class="['flex justify-between text-white uppercase p-2', getStatusClass(item.status)]">
          <span> {{ item.type }} </span>
          <span>{{ item.status }}</span>
        </div>
        <div class="flex justify-between p-2">
          <div class="flex flex-col">
            <div v-if="item.type === 'singles'">
              <p class="uppercase" v-if="item.betType === 'match'">
                {{ item.matchDetails ? `${reverseEngineerID(item.matchDetails.teamA.id)} vs ${reverseEngineerID(item.matchDetails.teamB.id)}` : 'Loading...' }}
              </p>
              <p class="uppercase" v-else-if="item.betType === 'event'">
                {{ item.eventDetails ? item.eventDetails.name : 'Loading...' }}
              </p>
            </div>
            <div v-else-if="item.type === 'multiple'">
              <p class="uppercase py-1" v-for="bet in item.bets" :key="bet.matchID">
                {{ bet.matchDetails ? `${reverseEngineerID(bet.matchDetails.teamA.id)} vs ${reverseEngineerID(bet.matchDetails.teamB.id)}` : 'Loading...' }}
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="space-y-2">
              <h2>Total Stake</h2>
              <p class="text-right md:font-semibold text-sm md:text-base">
                {{ new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.betAmount) }}
              </p>
            </div>
            <div class="space-y-2">
              <h2>Total Return</h2>
              <p class="text-right md:font-semibold text-sm md:text-base">
                {{ new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.potentialPayout) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

const db = useFirestore();
const userStore = useUserStore();

const loading = ref(true);
const error = ref(false);

const combinedBets = ref([]);
const uid = userStore.getUser.uid;

const matchCache = new Map();
const eventCache = new Map();

async function fetchMatch(matchID) {
  if (matchCache.has(matchID)) {
    return matchCache.get(matchID);
  }

  try {
    const matchDoc = await getDoc(doc(db, 'matches', matchID));
    if (matchDoc.exists()) {
      const matchData = matchDoc.data();
      matchCache.set(matchID, matchData);
      return matchData;
    } else {
      console.log(`No such match with ID: ${matchID}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching match:', error);
    return null;
  }
}

async function fetchEvent(eventID) {
  if (eventCache.has(eventID)) {
    return eventCache.get(eventID);
  }

  try {
    const eventDoc = await getDoc(doc(db, 'events', eventID));
    if (eventDoc.exists()) {
      const eventData = eventDoc.data();
      eventCache.set(eventID, eventData);
      return eventData;
    } else {
      console.log(`No such event with ID: ${eventID}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

async function fetchBetHistory() {
  loading.value = true;
  error.value = false;

  try {
    // Fetch single bets
    const betsQuery = query(
      collection(db, 'bets'),
      where('userID', '==', uid),
      orderBy('timestamp', 'desc')
    );
    const betsSnapshot = await getDocs(betsQuery);
    const bets = await Promise.all(betsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      let itemDetails = null;
      if (data.item.type === 'match') {
        itemDetails = await fetchMatch(data.item.id);
      } else if (data.item.type === 'event') {
        itemDetails = await fetchEvent(data.item.id);
      }
      return {
        ...data,
        id: doc.id,
        type: 'singles',
        betType: data.item.type,
        matchDetails: data.item.type === 'match' ? itemDetails : null,
        eventDetails: data.item.type === 'event' ? itemDetails : null,
        timestamp: data.timestamp.toDate()
      };
    }));

    // Fetch ticket bets
    const ticketsQuery = query(
      collection(db, 'tickets'),
      where('userID', '==', uid),
      orderBy('timestamp', 'desc')
    );
    const ticketsSnapshot = await getDocs(ticketsQuery);
    const tickets = await Promise.all(ticketsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const betsWithMatchDetails = await Promise.all(data.bets.map(async (bet) => {
        const matchDetails = await fetchMatch(bet.matchID);
        return {
          ...bet,
          matchDetails
        };
      }));
      return {
        ...data,
        id: doc.id,
        type: 'multiple',
        bets: betsWithMatchDetails,
        timestamp: data.timestamp.toDate()
      };
    }));

    // Combine and sort bets and tickets
    combinedBets.value = [...tickets, ...bets].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (e) {
    error.value = true;
    console.log(e);
  } finally {
    loading.value = false;
  }
}

// Call the function to fetch bet history
await fetchBetHistory();

function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

function reverseEngineerID(generatedID) {
  const namePart = generatedID.replace(/-[\da-f]+$/, "").split("-");
  const formattedName = namePart.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  return formattedName;
}

function getStatusClass(status) {
  switch (status) {
    case 'won':
      return 'bg-primary-700 dark:bg-primary-800';
    case 'lost':
      return 'bg-red-700';
    case 'pending':
      return 'bg-slate-700';
    default:
      return 'bg-slate-700';
  }
}
</script>


