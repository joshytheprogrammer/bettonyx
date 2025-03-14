<template>
  <div>
    <AppNavBar />
    <AppNavMBar />
    
    <main class="">
      <NuxtLoadingIndicator color="#76dbff" :height="4" />
      <NuxtPage  />
    </main>
    <UNotifications />
    <AppFooterAttribution />
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";

useSeoMeta({
  title: 'BettonyX - The Premier Betting Site for Covenant University',
  description: 'BettonyX is the ultimate betting platform for Covenant University students and non-students, offering opportunities to bet on all games played within CU.',
  keywords: 'Covenant University, betting, sports, events, swep 2024, BettonyX, sports betting, odds, bettony, Bettony',
  ogTitle: 'BettonyX - The Premier Betting Site for Covenant University',
  ogDescription: 'Join BettonyX and place your bets on a variety of games within Covenant University. Open to both students and non-students.',
  ogImage: 'https://res.cloudinary.com/dsgvwxygr/image/upload/v1723121262/eaglebet/nkvv4sumpixjo15bchr1.jpg',
  ogUrl: 'https://bettonyx.com',
  twitterTitle: 'BettonyX - The Premier Betting Site for Covenant University',
  twitterDescription: 'Bet on all Covenant University games with BettonyX. Open to students and non-students alike.',
  twitterImage: 'https://res.cloudinary.com/dsgvwxygr/image/upload/v1723121262/eaglebet/nkvv4sumpixjo15bchr1.jpg',
  twitterCard: 'summary'
});

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico'
    }
  ]
});

const userStore = useUserStore();
const userStatus = ref(userStore.getUserData.status);

</script>
<!-- <div class="max-w-[70%] mx-auto my-4 px-4">
      <UNotification 
      :ui="{
        background: 'bg-yellow-400 dark:bg-yellow-700'
      }"
      v-if="userStatus === 'frozen'"
      title="Your account has been frozen. Please contact customer support to identify and resolve any pending issues." 
      :id="1" 
      :timeout="0" 
      :close-button="{disabled: true}" 
      />
      <UNotification 
      :ui="{
        background: 'bg-red-500 dark:bg-red-900'
      }"
      v-if="userStatus === 'suspended'"
      title="Your account has been suspended. Please contact customer support to obtain more information regarding the suspension." 
      :id="1" 
      :timeout="0" 
      :close-button="{disabled: true}" 
      />
    </div> -->