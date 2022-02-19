<template>
  <div>
    <main
      :style="{
        background: `url(${backgroundImage})`,
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
          process starts with installation of <a href="https://nodejs.org/en/">Node.js</a>. Then you need to
          install <em>campaigner</em> npm package with <code>npm install campaigner</code> If you face any
          trouble, you can create an issue in
          <a href="https://github.com/jjaanila/campaigner/issues"
            >https://github.com/jjaanila/campaigner/issues</a
          >.
        </p>
        <section-title name="Campaign building blocks" />
        <p>
          This section contains descriptions of few files you will have to create in order to create a
          campaign. Don't create them from scratch, as you can always copy the example campaign files and
          modify them.
        </p>
        <area-title name="campaign.js" />
        <p>
          campaign.js defines the structure of the campaign. It is a JavaScript file in the root directory of
          your project that is loaded by the Vue Web app and contains descriptions for most of the pre-defined
          entities in the campaign, like monsters and conditions. It also describes the structure of the
          document and contains metadata about the document itself and its authors. campaign.js can be
          validated with <code>npx campaigner validate</code> command. See the root of campaigner project for
          example campaign.js.
        </p>
        <area-title name="Entry file" />
        <p>
          "entry" property in campaign.js defines the entry file that is passed to the Web app bundling
          library. It is the entry point the bundler uses to access your campaign code. Bundler will include
          all the required JS, CSS, etc. files based on the dependencies, i.e. imports, between them so you
          shouldn't need to worry about that. The entry file should be a JS file that imports and calls
          createCampaign function with the Vue app as an argument. For example like this:
        </p>
        <pre>
          import App from './App.vue'
          import { createCampaign } from '../src/index'

          createCampaign(App)
        </pre>
        <p>In the example campaign, index.js is the entry file.</p>
        <area-title name="Vue application" />
        <p>
          Vue application file, like App.vue in the example campaign, is the main file of the Vue Web app. It
          defines the looks of the web page and contains most of the textual content. You should divide your
          Vue app into multiple files to keep it manageable when it grows in size. All campaigner components
          are can be imported like this in the script portion like this
          <code>import { IdLink } from 'campaigner'</code> but you have to remember to add them in components
          property to be able to use them in the Vue template!
        </p>
        <section-title name="Running campaigner" />
        <p>
          After you have defined above files, you can run the campaigner with
          <code>npx campaigner start</code> The Vue app will soon open in your browser. With
          <code>npx campaigner build</code> you can build final optimized version of the campaign HTML file.
          It will be saved to /dist in you project root.
        </p>
        <chapter-title name="Components" />
        <section-title name="read-aloud" />
        <read-aloud>
          Once upon a time there was a <em>read-aloud</em> component. It was used in DnD campaigns when DMs
          wanted to reduce the amount of "uhms" in their story telling.
        </read-aloud>
        <section-title name="encounter" />
        <encounter
          :enemies="[
            { name: 'Swashbuckler of Long Name Islands', quantity: 3 },
            { name: 'Commoner', quantity: 5 },
          ]"
          :allies="[{ name: 'Commoner', quantity: 1 }]"
        />
        <section-title name="table-of-contents" />
        <p>
          Table of contents is a component that displays a list of chapters and sections in the campaign. It
          is shown on the left on top of everything and it follows the reader. Its content is rendered using
          "document" property of campaign.js file.
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
  name: 'App',
  data() {
    return {
      backgroundImage: require('../img/paper.jpg'),
    }
  },
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
  font-family: 'Merriweather', sans-serif;
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
code,
pre {
  display: block;
  margin: 1rem 0;
}
</style>
