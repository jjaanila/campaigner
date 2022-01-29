<template>
  <div class="read-aloud"><slot /></div>
</template>

<script>
export default {
  name: 'ReadAloud',
}
</script>

<style scoped>
.read-aloud {
  background-color: #f7f2e5;
  border-right: 2px solid #58180d;
  border-left: 2px solid #58180d;
  padding: 1rem;
  margin: 1rem 0;
}
</style>
