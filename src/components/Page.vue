<template>
  <div class="page"><slot /></div>
</template>

<script>
export default {
  name: 'Page',
  data() {
    return {}
  },
}
</script>

<style>
.page {
  width: calc(100vw - 8rem);
  margin: 4rem;
}
</style>
