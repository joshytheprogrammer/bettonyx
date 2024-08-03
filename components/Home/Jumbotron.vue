<!-- <template>
  <div class="lg:max-w-[80%] mx-auto px-4 sm:px-8 md:px-8 lg:px-18 my-8">
    <UCarousel v-slot="{ item }" :items="items2" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden" arrows indicators>
      <div class="w-full relative group">
        <img :src="item.imgLink" class="w-full h-[400px] object-cover" draggable="false">
        <div class="absolute bg-black bg-opacity-70 text-white px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md  w-fit h-fit m-auto inset-0">
          <h3 class="text-lg font-bold">{{ item.name }}</h3>
          <p class="mb-4">{{ item.desc }}</p>
          <a :href="item.ctaLink" class="inline-block bg-white text-primary-950 hover:bg-primary-100 text-sm font-semibold px-4 py-2 rounded-md">
            {{ item.ctaTitle }}
          </a>
        </div>
      </div>
    </UCarousel>
  </div>
</template> -->

<template>
  <div class="lg:max-w-[80%] mx-auto px-4 sm:px-8 md:px-8 lg:px-18 my-8" >
    <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden" arrows indicators>
      <img :src="item.imgLink" class="w-full h-[400px] object-cover" draggable="false">
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
const items = [
  {
    imgLink: 'https://res.cloudinary.com/dsgvwxygr/image/upload/f_auto,q_auto/v1/eaglebet/wcymb0uevynkaabwo7j9',
    name: 'Image 8',
    desc: 'Description for image 1',
    ctaTitle: 'Click Here',
    ctaLink: '#'
  },
  {
    imgLink: 'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1717559845/eaglebet/2_bznzhy.webp',
    name: 'Image 1',
    desc: 'Description for image 1',
    ctaTitle: 'Click Here',
    ctaLink: '#'
  },
  {
    imgLink: 'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754541/eaglebet/istockphoto-1408727786-612x612_pauwoj.webp',
    name: 'Image 2',
    desc: 'Description for image 2',
    ctaTitle: 'Learn More',
    ctaLink: '#'
  },
  {
    imgLink: 'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754541/eaglebet/istockphoto-1479399444-612x612_zrejyq.webp',
    name: 'Image 3',
    desc: 'Description for image 3',
    ctaTitle: 'Discover',
    ctaLink: '#'
  },
  {
    imgLink: 'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754541/eaglebet/istockphoto-1481875118-612x612_kqzcnq.webp',
    name: 'Image 4',
    desc: 'Description for image 4',
    ctaTitle: 'Read More',
    ctaLink: '#'
  },
  {
    imgLink: 'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754541/eaglebet/istockphoto-1939939054-612x612_w2tvzb.webp',
    name: 'Image 5',
    desc: 'Description for image 5',
    ctaTitle: 'Find Out',
    ctaLink: '#'
  },
  {
    imgLink: 'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754540/eaglebet/istockphoto-1405415173-612x612_jewdbm.webp',
    name: 'Image 6',
    desc: 'Description for image 6',
    ctaTitle: 'Get Started',
    ctaLink: '#'
  },
  {
    imgLink: 'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754540/eaglebet/istockphoto-1398971720-612x612_kteclt.webp',
    name: 'Image 7',
    desc: 'Description for image 7',
    ctaTitle: 'Join Now',
    ctaLink: '#'
  },
  {
    imgLink: 'https://res.cloudinary.com/dsgvwxygr/image/upload/e_improve,e_sharpen,c_scale,h_1200,q_auto:best/v1721754540/eaglebet/istockphoto-1360060900-612x612_zvihb4.webp',
    name: 'Image 8',
    desc: 'Description for image 8',
    ctaTitle: 'Sign Up',
    ctaLink: '#'
  }
];
</script>
