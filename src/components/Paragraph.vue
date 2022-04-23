<script setup></script>

<template>
  <p tabindex="0">
    <slot />
  </p>
</template>

<style scoped>
p {
  text-align: justify;
}
p + p {
  text-indent: 2em;
}
</style>
