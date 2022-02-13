<template>
  <div>
    <main
      :style="{
        background: `url(${require('../src/img/paper.jpg')})`,
      }"
    >
      <table-of-contents />
      <party />
      <page>
        <campaign-title />
        <part-title name="Creating a campaign" />
        <chapter-title name="Getting started" />
        <section-title name="Installing Campaigner" />
        <p>
          To install Campaigner, read instructions in
          <a href="https://github.com/jjaanila/campaigner">https://github.com/jjaanila/campaigner</a>. The
          process starts with installation of Node.js and npm. Then you need to install npm package
          <code>campaigner</code>. README.md should have detailed instructions for everything. If you face any
          trouble, you can create an issue in
          <a href="https://github.com/jjaanila/campaigner/issues"
            >https://github.com/jjaanila/campaigner/issues</a
          >.
        </p>
        <part-title name="Monsters" />
        <monster v-for="monster in monsters" v-bind="monster" :key="monster.name" />
      </page>
    </main>
    <combat-overlay />
  </div>
</template>

<script>
import 'normalize.css'

export default {
  name: 'app',
  computed: {
    monsters() {
      return this.$store.state.campaign.monsters
    },
  },
}
</script>

<style>
html {
  width: 100%;
  height: 100%;
}
.page {
  counter-reset: partcounter;
}
body {
  width: 100%;
  height: 100%;
  margin: 0;
}
address,
time {
  display: block;
  text-align: center;
}
main {
  font-family: 'Merriweather';
  position: absolute;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
}
p {
  text-align: justify;
}
p + p {
  text-indent: 2em;
}
</style>
