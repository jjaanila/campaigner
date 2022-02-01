<template>
  <div class="campaign-title-container">
    <h1 class="campaign-title">{{ name }}</h1>
    <address class="author">
      <a rel="author" class="url fn n" :href="authorUrl">{{ author }}</a>
    </address>
    <time pubdate :datetime="publishDate" :title="publishDate">on {{ publishDate }}</time>
  </div>
</template>

<script>
export default {
  name: 'CampaignTitle',
  props: {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorUrl: {
      type: String,
      required: true,
    },
    publishDate: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.campaign-title {
  text-align: center;
  counter-reset: h2counter;
}
.campaign-title-container {
  margin: 40vh 0 50vh 0;
}
a {
  color: black;
}
</style>
