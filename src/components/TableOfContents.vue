<template>
  <nav class="toc">
    <ol>
      <li class="toc-part" v-for="part in campaignStore.state.document.parts" :key="part.name">
        {{ part.name }}
        <ol>
          <li class="toc-chapter" v-for="chapter in part.chapters" :key="chapter.name">
            {{ chapter.name }}
            <ol>
              <li class="toc-section" v-for="section in chapter.sections" :key="section.name">
                {{ section.name }}
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
  inject: ['campaignStore'],
}
</script>

<style scoped>
.toc {
  counter-reset: tocpartcounter tocchaptercounter;
}
.toc ol {
  list-style-type: none;
}
.toc-part:before {
  counter-increment: tocpartcounter;
  content: 'Part ' counter(tocpartcounter) ': ';
}
.toc-chapter:before {
  counter-increment: tocchaptercounter;
  content: 'Ch. ' counter(tocchaptercounter) ': ';
}
</style>
