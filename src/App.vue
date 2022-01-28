<template>
  <main :style="{ background: `url(${require('./img/paper.jpg')})` }">
    <campaign-title name="Pohjola" />
    <part-title name="Background" />
    <chapter-title name="Start" />
    <section>
      <section-title name="Something" />
    </section>
    <part-title name="Story begins" />
    <chapter-title name="Middle" />
    <part-title name="Story ends" />
    <chapter-title name="End" />
  </main>
</template>

<script>
require('./components')

export default {
  name: 'app',
  data() {
    return {}
  },
}
</script>

<style>
html {
  width: 100%;
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
  margin: 0;
}
main {
  width: 100%;
  height: 100%;
  padding: 4rem;
}
</style>
