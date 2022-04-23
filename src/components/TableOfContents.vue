<template>
  <nav class="toc" aria-label="Table of contents" @click.stop="toggleToC()">
    <span tabindex="0">Table of Contents</span>
    <div v-if="isToCOpen">
      <input
        id="show-toc-always"
        v-model="showToCAlways"
        type="checkbox"
        name="show-toc-always"
        @click.stop
      />
      <label class="show-toc-always-label" for="show-toc-always">Keep open</label>
    </div>
    <ol v-if="isToCOpen">
      <li v-for="part in doc.parts" :key="part.name">
        <a class="toc-part" :href="`#${part.id}`" @click.stop>{{ part.name }}</a>
        <ol>
          <li v-for="child in part.children" :key="child.name">
            <a v-if="child.type === 'chapter'" class="toc-chapter" :href="`#${child.id}`" @click.stop>{{
              child.name
            }}</a>
            <ol v-if="child.type === 'chapter'">
              <li v-for="section in child.sections" :key="section.name">
                <a class="toc-section" :href="`#${section.id}`" @click.stop>{{ section.name }}</a>
              </li>
            </ol>
            <a v-if="child.type === 'section'" class="toc-section" :href="`#${child.id}`" @click.stop>{{
              child.name
            }}</a>
          </li>
        </ol>
      </li>
    </ol>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { generateId } from '../utils'
export default {
  name: 'TableOfContents',
  data() {
    return {
      titleElements: [],
    }
  },
  computed: {
    ...mapState('ui', ['isToCOpen']),
    showToCAlways: {
      get() {
        return this.$store.state.ui.showToCAlways
      },
      set(value) {
        this.$store.commit('ui/setShowToCAlways', value)
      },
    },
    doc() {
      const doc = { parts: [] }
      this.titleElements.forEach(titleElement => {
        const title = titleElement.textContent.trim()
        if (titleElement.classList.contains('part-title')) {
          doc.parts.push({
            name: title,
            id: generateId(title, 'part'),
            children: [],
          })
        } else if (titleElement.classList.contains('chapter-title')) {
          if (!doc.parts.length) {
            throw new Error(`There are no PartTitles before ChapterTitle ${title}`)
          }
          doc.parts[doc.parts.length - 1].children.push({
            name: title,
            id: generateId(title, 'chapter'),
            sections: [],
            type: 'chapter',
          })
        } else if (titleElement.classList.contains('section-title')) {
          if (!doc.parts.length) {
            throw new Error(`There are no PartTitles before SectionTitle ${title}`)
          }
          const lastChapterOfLastPart = [...doc.parts[doc.parts.length - 1].children]
            .reverse()
            .find(child => child.type === 'chapter')
          const section = {
            name: title,
            id: generateId(title, 'section'),
            type: 'section',
          }
          if (lastChapterOfLastPart) {
            lastChapterOfLastPart.sections.push(section)
          } else {
            doc.parts[doc.parts.length - 1].children.push(section)
          }
        }
      })
      return doc
    },
  },
  /**
   * Generates the table of contents from the document by reading DOM.
   * Is strict about the precedence of title types and their order in DOM.
   * A part has to come before chapters, and a chapter has to come before sections.
   * I tried observing also changes in title elements, but it didn't work with Webpack HMR.
   * Part may contain chapters and sections. Chapters should contain only sections.
   */
  mounted() {
    this.$nextTick(() => {
      this.refreshTitleElements()
      this.mainObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            const titleWasAddedorRemoved = mutation.addedNodes
              .concat(mutation.removedNodes)
              .some(
                node =>
                  node.classList.contains('part-title') ||
                  node.classList.contains('chapter-title') ||
                  node.classList.contains('section-title')
              )
            if (titleWasAddedorRemoved) {
              this.refreshTitleElements()
              break
            }
          }
        }
      })
      this.mainObserver.observe(window.document.querySelector('main'), {
        characterData: false,
        attributes: false,
        childList: true,
        subtree: false,
      })
    })
  },
  unmounted() {
    this.mainObserver.disconnect()
  },
  methods: {
    ...mapActions('ui', ['toggleToC']),
    refreshTitleElements() {
      this.titleElements = window.document.querySelectorAll('main .part-title,.chapter-title,.section-title')
    },
  },
}
</script>

<style scoped>
.toc {
  counter-reset: tocpartcounter tocchaptercounter;
  position: fixed;
  left: 0;
  top: 0;
  max-width: 20rem;
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
.show-toc-always-label {
  margin-left: 0.25rem;
}
.toc-section {
  font-size: 0.75rem;
}
</style>
