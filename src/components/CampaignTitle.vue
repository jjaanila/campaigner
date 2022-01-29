<template>
  <h1 class="campaign-title">{{ name }}</h1>
</template>

<script>
export default {
  name: 'CampaignTitle',
  props: {
    name: String,
    required: true,
  },
  data() {
    return {}
  },
}
</script>

<style></style>
