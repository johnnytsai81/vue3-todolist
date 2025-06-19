<script setup lang="ts">
import { computed } from 'vue'
import Navbar from "@/components/Navbar.vue";
import { useUtilityStore } from '@/stores/utilityStore'
import { useWindowResize } from '@/composables/useWindowResize'

const { isLargePad } = useWindowResize();

const utilityStore = useUtilityStore()
const isMenuShow = computed(() => utilityStore.isMenuShow)
</script>

<template>
  <main>
    <div
      class="position-relative min-h-screen"
    >
      <div class="flex">
        <div
          class="absolute lg:relative h-screen w-[300px] bg-green-300 z-[2] transition-transform duration-300"
          :class="isLargePad ? isMenuShow ? 'translate-x-0' : '-translate-x-full' : ''"
        >
          <Navbar />
        </div>
        <div class="flex-1">
          <slot></slot>
        </div>
      </div>
    </div>
  </main>
</template>