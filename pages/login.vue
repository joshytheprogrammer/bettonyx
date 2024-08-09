<template>
  <div>
    <AuthLogin />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});

useSeoMeta({
  title: 'Login to BettonyX - Your Gateway to Betting on Covenant University Games',
  description: 'Access your BettonyX account to start betting on all the exciting games at Covenant University. Log in securely and place your bets.',
  ogTitle: 'Login to BettonyX - Your Gateway to Betting on Covenant University Games',
  ogDescription: 'Log in to BettonyX and start betting on Covenant University games. Join the action today!',
  ogImage: 'https://res.cloudinary.com/dsgvwxygr/image/upload/v1723121262/eaglebet/nkvv4sumpixjo15bchr1.jpg',
  ogUrl: 'https://bettonyx.com/login',
  twitterTitle: 'Login to BettonyX - Your Gateway to Betting on Covenant University Games',
  twitterDescription: 'Securely log in to your BettonyX account and place your bets on Covenant University games.',
  twitterImage: 'https://res.cloudinary.com/dsgvwxygr/image/upload/v1723121262/eaglebet/nkvv4sumpixjo15bchr1.jpg',
  twitterCard: 'summary'
});

</script>

<style lang="scss" scoped>

</style>