<template>
  <figure :id="figureId" class="captioned-figure">
    <figcaption>{{ caption }}</figcaption>
    <img :src="path" :alt="caption" :style="imgStyle" />
  </figure>
</template>

<script>
export default {
  name: 'CaptionedFigure',
  props: {
    path: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    width: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  computed: {
    imgStyle() {
      return `width: ${this.width ?? 'unset'}`
    },
    figureId() {
      if (this.id) {
        return this.id
      }
      // This isn't probably a good idea but let's try autogenerating the id
      const matches = this.path.match(/[^\/\\]+?$/)
      if (matches) {
        return matches[matches.length - 1].replaceAll(/\W/g, '-')
      }
    },
  },
}
</script>

<style scoped>
.captioned-figure {
  max-width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
}
img {
  max-width: 100%;
}
figcaption {
  margin-bottom: 0.5rem;
  text-align: center;
}
figcaption:before {
  content: 'Figure ' counter(figurecounter) ':\0000a0\0000a0';
  counter-increment: figurecounter;
}
</style>
