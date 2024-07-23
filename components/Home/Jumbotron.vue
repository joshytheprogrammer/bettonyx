<template>
  <div class="lg:max-w-[80%] mx-auto px-4 sm:px-8 md:px-8 lg:px-18 my-8" >
    <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden" arrows indicators>
      <img :src="item" class="w-full h-[400px] object-cover" draggable="false">
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
const items = [
  
  'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1717559845/eaglebet/2_bznzhy.webp'
]
</script>

<style lang="scss" scoped>

</style>