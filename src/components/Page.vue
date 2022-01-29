<template>
  <div class="page"><slot /></div>
</template>

<script>
export default {
  name: 'Page',
}
</script>

<style>
.page {
  width: 60%;
  margin: 8rem;
}
@media only screen and (max-width: 600px) {
  .page {
    width: calc(100% - 2rem);
    margin: 1rem;
  }
}
</style>
