<template>
  <div :id="commentId" class="comment">
    <span class="comment-title" tabindex="0">{{ title }}</span>
    <span class="comment-body" tabindex="0"><slot /></span>
  </div>
</template>

<script>
import { generateId } from '../utils'
export default {
  name: 'Comment',
  props: {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
    },
  },
  computed: {
    commentId() {
      return this.id ?? generateId(this.title, 'comment')
    },
  },
}
</script>

<style scoped>
.comment {
  background-color: #e0e5c1;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
}
.comment-title {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}
</style>
