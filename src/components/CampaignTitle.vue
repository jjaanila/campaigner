<template>
  <div class="campaign-title-container">
    <h1 class="campaign-title">{{ campaignStore.state.title }}</h1>
    <address class="author">
      <a rel="author" class="url fn n" :href="campaignStore.state.authorUrl">{{ campaignStore.state.author }}</a>
    </address>
    <time pubdate :datetime="campaignStore.state.publishDate" :title="campaignStore.state.publishDate"
      >on {{ campaignStore.state.publishDate }}</time
    >
  </div>
</template>

<script>
export default {
  name: 'CampaignTitle',
  inject: ['campaignStore'],
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
