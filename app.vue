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
useSeoMeta({
  title: 'BettonyX - The Premier Betting Site for Covenant University',
  description: 'BettonyX is the ultimate betting platform for Covenant University students and non-students, offering opportunities to bet on all games played within CU.',
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
</script>
