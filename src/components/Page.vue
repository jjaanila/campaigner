<template>
  <div v-on:click="uiStore.closeToC()" :class="`page ${uiStore.state.isToCOpen ? 'toc-open' : ''}`"><slot /></div>
</template>

<script>
export default {
  name: 'Page',
  inject: ['uiStore'],
}
</script>

<style>
.page {
  width: 60%;
  margin: 0 8rem 4rem 200px;
}
.toc-open {
  margin-left: calc(250px + 2rem);
}
@media only screen and (max-width: 600px) {
  .page {
    width: calc(100% - 2rem);
    margin: 1rem;
  }
}
</style>
