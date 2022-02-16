<template>
  <div class="campaign-title-container">
    <h1 class="campaign-title">
      {{ title }}
    </h1>
    <address class="author">
      <a rel="author" class="url fn n" :href="authorUrl">{{ author }}</a>
    </address>
    <time pubdate :datetime="publishDate" :title="publishDate">on {{ publishDate }}</time>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CampaignTitle',
  computed: {
    ...mapState('campaign', ['title', 'author', 'authorUrl', 'publishDate']),
  },
}
</script>

<style scoped>
.campaign-title {
  font-family: 'Cinzel', sans-serif;
  text-align: center;
  counter-reset: partcounter chaptercounter;
}
.campaign-title-container {
  margin: 40vh 0 50vh 0;
}
a {
  color: black;
}
</style>
