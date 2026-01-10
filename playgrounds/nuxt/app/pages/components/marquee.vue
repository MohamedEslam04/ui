<script setup lang="ts">
import theme from '#build/ui/marquee'

const orientations = Object.keys(theme.variants.orientation)

const orientation = ref('horizontal' as keyof typeof theme.variants.orientation)
const pauseOnHover = ref(false)
const pauseOnTouch = ref(false)
const reverse = ref(false)
const overlay = ref(false)
const repeat = ref(3)
const duration = ref(20)
const pauseOnClick = ref(false)
</script>

<template>
  <Navbar>
    <USelect v-model="orientation" :items="orientations" />
    <USwitch v-model="pauseOnHover" label="Pause" />
    <USwitch v-model="pauseOnTouch" label="Pause on Touch" />
    <USwitch v-model="pauseOnClick" label="Pause on Click" />
    <USwitch v-model="reverse" label="Reverse" />
    <USwitch v-model="overlay" label="Overlay" />
    <UInputNumber v-model="repeat" :min="1" :max="10" />
    <UInputNumber v-model="duration" :min="1" :max="100" />
  </Navbar>

  <UMarquee
    :orientation="orientation"
    :pause-on-hover="pauseOnHover"
    :pause-on-touch="pauseOnTouch"
    :pause-on-click="pauseOnClick"
    :reverse="reverse"
    :overlay="overlay"
    :repeat="repeat"
    :duration="duration"
    class="data-[orientation=horizontal]:w-lg"
  >
    <UIcon name="simple-icons:github" class="size-10 shrink-0" />
    <UIcon name="simple-icons:discord" class="size-10 shrink-0" />
    <UIcon name="simple-icons:x" class="size-10 shrink-0" />
    <UIcon name="simple-icons:instagram" class="size-10 shrink-0" />
    <UIcon name="simple-icons:linkedin" class="size-10 shrink-0" />
    <UIcon name="simple-icons:facebook" class="size-10 shrink-0" />
    <UButton label="Click Me" color="neutral" variant="subtle" size="xs" @click="console.log('Button clicked!')" />
  </UMarquee>
</template>
