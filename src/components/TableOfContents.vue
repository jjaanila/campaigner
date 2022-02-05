<template>
  <nav class="toc" v-on:click="uiStore.toggleToC()">
    <span>Table of Contents</span>
    <div v-if="uiStore.state.isToCOpen">
      <input
        type="checkbox"
        id="show-toc-always"
        name="show-toc-always"
        v-on:click.stop
        v-model="uiStore.state.showTocAlways"
      />
      <label for="show-toc-always">Keep open</label>
    </div>
    <ol v-if="uiStore.state.isToCOpen">
      <li v-for="part in campaignStore.state.document.parts" :key="part.name">
        <a class="toc-part" v-on:click.stop :href="`#${part.id}`">{{ part.name }}</a>
        <ol>
          <li v-for="chapter in part.chapters" :key="chapter.name">
            <a class="toc-chapter" v-on:click.stop :href="`#${chapter.id}`">{{ chapter.name }}</a>
            <ol>
              <li v-for="section in chapter.sections" :key="section.name">
                <a class="toc-section" v-on:click.stop :href="`#${section.id}`">{{ section.name }}</a>
              </li>
            </ol>
          </li>
        </ol>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'TableOfContents',
  inject: ['campaignStore', 'uiStore'],
}
</script>

<style scoped>
.toc {
  counter-reset: tocpartcounter tocchaptercounter;
  position: fixed;
  left: 0;
  top: 0;
  max-width: 250px;
  font-family: 'Cinzel', sans-serif;
  text-indent: 0;
  background-color: #f2ead6;
  padding: 1rem;
  border-bottom-right-radius: 10px;
  border-bottom: 1px solid #c9ad6a;
  border-right: 1px solid #c9ad6a;
  box-shadow: 0.1rem 0.2rem 0.2rem rgba(0, 0, 0, 0.3);
}
.toc ol {
  list-style-type: none;
  padding: 0;
}
.toc-part:before {
  counter-increment: tocpartcounter;
  content: 'Part ' counter(tocpartcounter) ': ';
}
.toc-chapter:before {
  counter-increment: tocchaptercounter;
  content: 'Ch. ' counter(tocchaptercounter) ': ';
}
.toc a {
  color: #58180d;
  text-decoration: none;
}
.toc a:hover {
  color: #581000;
  font-weight: 700;
  cursor: pointer;
}
.toc-part {
  border-bottom: 2px solid #c9ad6a;
  display: block;
  line-height: 0.8rem;
  margin: 0.5rem 0 0.5rem 0;
}
.toc #show-toc-always {
  text-align: left;
  margin-top: 1rem;
}
.toc-section {
  font-size: 0.75rem;
}
</style>
