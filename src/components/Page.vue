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
  column-count: 2;
}
</style>
