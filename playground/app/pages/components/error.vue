<template>
  <UError
    :error="{
      statusCode: 404,
      statusMessage: 'Page not',
      message: 'The page you are looking for does not exist.',
      fatal: false,
      unhandled: false,
      name: 'NuxtError',
      toJSON: () => ({
        statusCode: 404,
        statusMessage: 'Page not found',
        message: 'The page you are looking for does not exist.'
      })
    }"
  />
</template>
