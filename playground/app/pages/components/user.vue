<template>
  <UUser
    name="John Doe"
    description="Software Engineer"
    :avatar="{
      src: 'https://i.pravatar.cc/150?u=john-doe'
    }"
    chip
    size="xl"
  />
  <UUser
    orientation="vertical"
    name="John Doe"
    description="Software Engineer"
    chip
    :avatar="{
      src: 'https://i.pravatar.cc/150?u=john-doe'
    }"
  />
</template>
