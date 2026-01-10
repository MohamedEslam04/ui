<script setup lang="ts">
import type { ConfettiProps } from '#ui/types'
import { toRaw } from 'vue'

const { fire, fireRealistic, fireFireworks, fireSnow, firePride, fireStars } = useConfetti()

const confettiRef = ref<{ fire: (options?: any) => void } | null>(null)

const states = reactive<ConfettiProps>({
  particleCount: 150,
  angle: 90,
  spread: 70,
  startVelocity: 45,
  ticks: 200,
  gravity: 1,
  decay: 0.9,
  scalar: 1,
  drift: 0,
  zIndex: 100
})

const items = [
  { label: 'Circle', value: 'circle' },
  { label: 'Square', value: 'square' },
  { label: 'Star', value: 'star' }
]

const selectedShapes = ref(['circle', 'square'])

const colors = ref(['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'])

const fireCustom = () => {
  fire({
    ...toRaw(states),
    shapes: toRaw(selectedShapes.value) as any,
    colors: toRaw(colors.value)
  })
}
</script>

<template>
  <div class="p-12 space-y-12 min-h-screen">
    <div class="text-center max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold mb-4 tracking-tight">
        Confetti
      </h1>
      <p class="text-xl text-description">
        Beautiful, high-performance confetti animations for your Nuxt application.
      </p>
    </div>

    <!-- Presets Section -->
    <section class="space-y-6">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-primary" />
        <h2 class="text-2xl font-bold">
          Presets
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard class="group hover:ring-2 hover:ring-primary transition-all">
          <template #header>
            <h3 class="font-bold text-lg">
              Realistic
            </h3>
          </template>
          <p class="text-sm text-description mb-6">
            Multiple staggered bursts for a natural gravity effect.
          </p>
          <UButton block color="neutral" variant="subtle" @click="fireRealistic()">
            Fire Realistic
          </UButton>
        </UCard>

        <UCard class="group hover:ring-2 hover:ring-primary transition-all">
          <template #header>
            <h3 class="font-bold text-lg">
              Fireworks
            </h3>
          </template>
          <p class="text-sm text-description mb-6">
            Continuous explosive bursts from random positions.
          </p>
          <UButton block color="neutral" variant="subtle" @click="fireFireworks()">
            Fire Fireworks
          </UButton>
        </UCard>

        <UCard class="group hover:ring-2 hover:ring-primary transition-all">
          <template #header>
            <h3 class="font-bold text-lg">
              Snow
            </h3>
          </template>
          <p class="text-sm text-description mb-6">
            A gentle, falling snow effect across the screen.
          </p>
          <UButton block color="neutral" variant="subtle" @click="fireSnow()">
            Let it Snow
          </UButton>
        </UCard>

        <UCard class="group hover:ring-2 hover:ring-primary transition-all">
          <template #header>
            <h3 class="font-bold text-lg">
              School Pride
            </h3>
          </template>
          <p class="text-sm text-description mb-6">
            Two continuous cannons blasting from the corners.
          </p>
          <UButton block color="neutral" variant="subtle" @click="firePride()">
            Fire Pride
          </UButton>
        </UCard>

        <UCard class="group hover:ring-2 hover:ring-primary transition-all">
          <template #header>
            <h3 class="font-bold text-lg">
              Stars
            </h3>
          </template>
          <p class="text-sm text-description mb-6">
            Magical star-shaped particles with golden colors.
          </p>
          <UButton block color="neutral" variant="subtle" @click="fireStars()">
            Fire Stars
          </UButton>
        </UCard>

        <UCard class="group hover:ring-2 hover:ring-primary transition-all">
          <template #header>
            <h3 class="font-bold text-lg">
              Auto-fire
            </h3>
          </template>
          <p class="text-sm text-description mb-6">
            Declarative component that fires on mount.
          </p>
          <div class="flex items-center justify-center p-4 border border-dashed rounded-lg bg-surface">
            <UConfetti ref="confettiRef" :autofire="false" />
            <UButton block color="neutral" variant="subtle" @click="() => (confettiRef as any)?.fire()">
              Fire Component
            </UButton>
          </div>
        </UCard>
      </div>
    </section>

    <!-- Customization Section -->
    <section class="space-y-6">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5 text-primary" />
        <h2 class="text-2xl font-bold">
          Custom Configuration
        </h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <UCard class="lg:col-span-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Particle Count" description="Number of particles to fire">
              <USlider v-model="states.particleCount" :min="1" :max="500" />
            </UFormField>

            <UFormField label="Angle" description="The direction in degrees">
              <USlider v-model="states.angle" :min="0" :max="360" />
            </UFormField>

            <UFormField label="Spread" description="The spread in degrees">
              <USlider v-model="states.spread" :min="0" :max="360" />
            </UFormField>

            <UFormField label="Velocity" description="The initial velocity">
              <USlider v-model="states.startVelocity" :min="1" :max="100" />
            </UFormField>

            <UFormField label="Gravity" description="How fast particles fall">
              <USlider v-model="states.gravity" :min="0" :max="5" :step="0.1" />
            </UFormField>

            <UFormField label="Decay" description="How fast particles lose speed">
              <USlider v-model="states.decay" :min="0" :max="1" :step="0.01" />
            </UFormField>

            <UFormField label="Shapes">
              <UCheckboxGroup v-model="selectedShapes" :items="items" />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton size="xl" icon="i-heroicons-sparkles" @click="fireCustom">
                Fire Custom Confetti
              </UButton>
            </div>
          </template>
        </UCard>

        <div class="space-y-6">
          <UCard>
            <template #header>
              <h4 class="font-bold">
                Code Snippet
              </h4>
            </template>
            <pre class="text-xs bg-slate-900 text-white p-4 rounded overflow-x-auto"><code>const { fire } = useConfetti()

fire({
  particleCount: {{ states.particleCount }},
  spread: {{ states.spread }},
  angle: {{ states.angle }},
  shapes: {{ JSON.stringify(selectedShapes) }}
})</code></pre>
          </UCard>
        </div>
      </div>
    </section>
  </div>
</template>
