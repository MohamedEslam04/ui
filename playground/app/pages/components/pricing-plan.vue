<template>
  <UPricingPlan
    title="Solo"
    description="For bootstrappers and indie hackers."
    price="$249"
    :features="[
      'One developer',
      'Unlimited projects',
      'Access to GitHub repository',
      'Unlimited patch & minor updates',
      'Lifetime access'
    ]"
  />
  <UPricingPlan
    title="Solo"
    description="For bootstrappers and indie hackers."
    price="$249"
    :features="features"
  />
  <UPricingPlan
    title="Solo"
    description="For bootstrappers and indie hackers."
    price="$249"
    :features="[
      'One developer',
      'Unlimited projects',
      'Access to GitHub repository',
      'Lifetime access'
    ]"
    :button="{
      label: 'Buy now'
    }"
    orientation="horizontal"
    variant="outline"
  />
</template>

<script setup lang="ts">
const features = ref([
  {
    title: 'One developer',
    icon: 'i-lucide-user'
  },
  {
    title: 'Unlimited projects',
    icon: 'i-lucide-infinity'
  },
  {
    title: 'Access to GitHub repository',
    icon: 'i-lucide-github'
  },
  {
    title: 'Unlimited patch & minor updates',
    icon: 'i-lucide-refresh-cw'
  },
  {
    title: 'Lifetime access',
    icon: 'i-lucide-clock'
  }
])
</script>
