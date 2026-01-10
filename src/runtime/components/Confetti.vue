<script lang="ts">
export interface ConfettiProps {
  /**
   * Whether to fire the confetti immediately on mount.
   * @defaultValue true
   */
  autofire?: boolean
  /**
   * The number of particles to fire.
   * @defaultValue 150
   */
  particleCount?: number
  /**
   * The angle of the confetti in degrees.
   * @defaultValue 90
   */
  angle?: number
  /**
   * The spread of the confetti in degrees.
   * @defaultValue 70
   */
  spread?: number
  /**
   * The velocity of the confetti.
   * @defaultValue 45
   */
  startVelocity?: number
  /**
   * How many times the particles will be updated.
   * @defaultValue 200
   */
  ticks?: number
  /**
   * The origin of the confetti.
   * @defaultValue { y: 0.6 }
   */
  origin?: { x?: number, y?: number }
  /**
   * Colors to use for the confetti.
   */
  colors?: string[]
  /**
   * The shapes to use for the confetti.
   */
  shapes?: confetti.Shape[]
  /**
   * Scale factor for the particles.
   * @defaultValue 1
   */
  scalar?: number
  /**
   * Gravity factor.
   * @defaultValue 1
   */
  gravity?: number
  /**
   * Drift factor.
   * @defaultValue 0
   */
  drift?: number
  /**
   * Decay factor.
   * @defaultValue 0.9
   */
  decay?: number
  /**
   * z-index of the confetti.
   * @defaultValue 100
   */
  zIndex?: number
  /**
   * Fix the confetti to a specific position.
   */
  fixed?: boolean
}
</script>

<script setup lang="ts">
import { onMounted, toRaw } from 'vue'
import confetti from 'canvas-confetti'

const props = withDefaults(defineProps<ConfettiProps>(), {
  autofire: true,
  particleCount: 150,
  angle: 90,
  spread: 70,
  startVelocity: 45,
  ticks: 200,
  origin: () => ({ y: 0.6 }),
  scalar: 1,
  gravity: 1,
  drift: 0,
  decay: 0.9,
  zIndex: 100
})

const fire = (options: confetti.Options = {}) => {
  confetti({
    particleCount: props.particleCount,
    angle: props.angle,
    spread: props.spread,
    startVelocity: props.startVelocity,
    ticks: props.ticks,
    origin: toRaw(props.origin),
    colors: toRaw(props.colors),
    shapes: toRaw(props.shapes),
    scalar: props.scalar,
    gravity: props.gravity,
    drift: props.drift,
    decay: props.decay,
    zIndex: props.zIndex,
    ...toRaw(options)
  })
}

onMounted(() => {
  if (props.autofire) {
    fire()
  }
})

defineExpose({
  fire
})
</script>

<template>
  <div hidden />
</template>
