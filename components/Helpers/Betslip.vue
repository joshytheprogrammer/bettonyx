<template>
  <div class="border py-4 px-2">
    <!-- {{ betslipStore.getBetSlip }} -->
    <h2 class="font-normal text-2xl pb-4">Betslip</h2>
    <div class="border-y py-4 flex justify-between" v-if="betslipStore.getBetCount > 0">
      <span class="underline underline-offset-8 decoration-secondary-700 capitalize">{{ betslipStore.getBetType }}s</span>
    </div>
    <div class="" v-if="betslipStore.getBetCount > 0">
      <div class="flex flex-col">
        <div class="flex flex-col gap-2 border-b py-4" v-for="(item, index) in betslipStore.getBetSlip" :key="index">
          <div class="flex justify-between">
            <span class="text-sm uppercase">{{ reverseEngineerID(item.match.teamA.id) }} VS {{ reverseEngineerID(item.match.teamB.id) }}</span>
            <span @click="removeBet(item.match.id, item.teamBetOn)" class="text-xs hover:text-red-600 cursor-pointer">x</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="bg-gray-300 dark:bg-gray-400 dark:text-black rounded-md p-2 text-sm">
              {{ getBetOdds(item) }}
            </div>
            <span class="text-sm uppercase">
              {{ getBetTeamName(item) }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3 py-4">
        <div class="w-full">
          <input type="text" class="w-full rounded-md border-0 p-1.5 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-secondary-800 sm:text-sm sm:leading-6 bg-gray-200 dark:bg-transparent focus:bg-transparent" placeholder="Stake Amount" v-model="betslipStore.betAmount" />
        </div>
        <div class="flex justify-between">
          <span>Amount</span>
          <span>
            {{ 
              new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(betslipStore.getBetAmount) 
            }}
          </span>
        </div>
        <div class="flex justify-between">
          <span>Total Odds</span>
          <span>{{ totalOdds }}</span>
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
        <UButton v-else :loading="loading" :disabled="loading" class="bg-secondary-800 flex items-center justify-center hover:bg-secondary-900 text-center w-full rounded-md text-white py-2 text-sm" @click="placeBet">Place Bet</UButton>
      </div>
    </div>
    <div class="space-y-4" v-else>
      <p class="text-xs leading-6"> To place a bet, click on the odds. Or insert a booking code</p>
      <div class="flex flex-col gap-4 md:gap-2">
        <UInput placeholder="Ticket Code" />
        <button class="w-full bg-gray-500 text-slate-200 cursor-not-allowed rounded-md text-sm py-4">Load Ticket</button>
      </div>
      <p class="text-xs leading-6 text-slate-400 dark:text-slate-300">A ticket code enables one to transfer a betslip between different devices.</p>
    </div>
  </div>
</template>

<script setup>
import { useBetslipStore } from "@/store/betslip";
import { useUserStore } from "@/store/user";

const betslipStore = useBetslipStore();
const userStore = useUserStore();
const router = useRouter();

const toast = useToast();

const uid = userStore.getUser.uid;
const totalOdds = computed(() => betslipStore.totalOdds);
const potentialPayout = computed(() => betslipStore.potentialPayout);

const loading = ref(false);

function reverseEngineerID(generatedID) {
  const namePart = generatedID.replace(/-[\da-f]+$/, "").split("-");
  const formattedName = namePart.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  return formattedName;
}

function getBetOdds(item) {
  if (item.teamBetOn === 'draw') {
    return item.match.drawOdds;
  } else if (item.teamBetOn === 'teamA') {
    return item.match.teamA.odds;
  } else if (item.teamBetOn === 'teamB') {
    return item.match.teamB.odds;
  }
}

function getBetTeamName(item) {
  if (item.teamBetOn === 'draw') {
    return 'Draw';
  } else if(item.teamBetOn === 'teamA') {
    return reverseEngineerID(item.match.teamA.id);
  }else if(item.teamBetOn === 'teamB') {
    return reverseEngineerID(item.match.teamB.id);
  }
}

function removeBet(matchID, teamBetOn) {
  betslipStore.removeBet(matchID, teamBetOn.id ? teamBetOn.id : teamBetOn);
}

const placeBet = async () => {
  loading.value = true;
  try {
    if (betslipStore.getBetType === 'single') {
      const bet = betslipStore.getBetSlip[0]; // Single bet, only one item in betslip

      if (betslipStore.getBetAmount < 100) {
        toast.add({ title: 'Validation Error', description: 'Amount must be at least 100', color: 'red' });
        return;
      }

      if (betslipStore.getBetAmount > userStore.getBalance) {
        toast.add({ title: 'Insufficient Funds', description: 'Fund your account.', color: 'red' });
        return;
      }

      const response = await $fetch('/api/create/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: uid,
          matchID: bet.match.id,
          teamBetOn: bet.teamBetOn,
          betAmount: betslipStore.getBetAmount,
          oddsAtBetTime: betslipStore.totalOdds,
        }),
      });

      // console.log(response);

      if (response.status === 200) {
        betslipStore.clearBetslip();
        toast.add({ title: 'Bet Placed. Good Luck', description: 'Check your bet history for more details.' });
      } else {
        toast.add({ title: 'Failed to place bet', description: 'Check your bet history and balance', color: 'red' });
      }
    } else {
      // Handle multiple bet case
      if (betslipStore.getBetAmount < 100) {
        toast.add({ title: 'Validation Error', description: 'Amount must be at least 100', color: 'red' });
        return;
      }

      if (betslipStore.getBetAmount > userStore.getBalance) {
        toast.add({ title: 'Insufficient Funds', description: 'Fund your account.', color: 'red' });
        return;
      }

      const bets = betslipStore.getBetSlip.map(bet => ({
        matchID: bet.match.id,
        teamBetOn: bet.teamBetOn,
        status: 'pending',
        oddsAtBetTime: (bet.teamBetOn === 'draw') 
          ? bet.match.drawOdds 
          : (bet.teamBetOn === 'teamA') 
          ? bet.match.teamA.odds 
          : bet.match.teamB.odds,
      }));

      const response = await $fetch('/api/create/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: uid,
          bets: bets,
          betAmount: betslipStore.getBetAmount,
          totalOdds: betslipStore.totalOdds,
        }),
      });

      console.log(response);

      if (response.status === 200) {
        betslipStore.clearBetslip();
        toast.add({ title: 'Ticket Placed. Good Luck', description: 'Check your bet history for more details.' });
      } else {
        toast.add({ title: 'Failed to place ticket', description: 'Check your bet history and balance', color: 'red' });
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    loading.value = false;
  }
};


</script>

<style scoped>
.border {
  border: 1px solid #ddd;
}
</style>
