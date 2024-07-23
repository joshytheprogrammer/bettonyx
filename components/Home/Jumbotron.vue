<template>
  <div class="lg:max-w-[80%] mx-auto px-4 sm:px-8 md:px-8 lg:px-18 my-8" >
    <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden" arrows indicators>
      <!-- <img :src="item" class="w-full h-[400px] object-cover" draggable="false"> -->
      <img :src="item" class="w-full h-[400px] object-cover" draggable="false">
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
const items = [
  'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1717559845/eaglebet/2_bznzhy.webp',
  'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754541/eaglebet/istockphoto-1408727786-612x612_pauwoj.webp',
  'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754541/eaglebet/istockphoto-1479399444-612x612_zrejyq.webp',
  'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754541/eaglebet/istockphoto-1481875118-612x612_kqzcnq.webp',
  'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754541/eaglebet/istockphoto-1939939054-612x612_w2tvzb.webp',
  'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754540/eaglebet/istockphoto-1405415173-612x612_jewdbm.webp',
  'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754540/eaglebet/istockphoto-1398971720-612x612_kteclt.webp',
  'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754540/eaglebet/istockphoto-1360060900-612x612_zvihb4.webp'

]
</script>

<style lang="scss" scoped>

</style>