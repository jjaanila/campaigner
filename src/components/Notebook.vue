<template>
  <MenuItem :icon="notebookIcon" title="Notebook">
    <div class="notebook-container" @click.stop>
      <button
        v-show="!shownRecord"
        class="notebook-add-record-button"
        title="Add record"
        @click="startRecordCreation()"
      >
        +
      </button>
      <input
        v-show="!shownRecord"
        class="notebook-search"
        placeholder="Search..."
        :value="search"
        @input="search = $event.target.value"
      />
      <div v-if="pages.length > 1" v-show="!shownRecord" class="notebook-pagination">
        {{ pages.length ? currentPage + 1 : 0 }} / {{ pages.length }}
        <button @click="currentPage = Math.max(currentPage - 1, 0)">-</button>
        <button @click="currentPage = Math.min(currentPage + 1, pages.length - 1)">+</button>
      </div>
      <ol v-show="!shownRecord" class="notebook-records-list">
        <li v-for="record in pages[currentPage]" :key="record.id">
          <button class="notebook-record-button" :title="record.title" @click="openRecord(record.id)">
            {{ record.title }}
          </button>
        </li>
        <li v-show="records.length === 0">
          <span>No records</span>
        </li>
      </ol>
      <div v-if="shownRecord" class="notebook-record">
        <input
          placeholder="Title"
          :value="shownRecord.title"
          @input="updateRecordTitle($event.target.value)"
        />
        <textarea ref="record" :value="shownRecord.text" @input="updateRecordText($event.target.value)" />
        <div class="record-control-button-container">
          <button v-show="shownRecord.id === null" @click="createRecord()">Save</button>
          <button @click="closeRecord()">Close</button>
          <button v-show="shownRecord.id !== null" class="record-delete-button" @click="removeRecord()">
            Delete
          </button>
        </div>
      </div>
    </div>
  </MenuItem>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NotebookIcon from '../img/notebook.svg'
import MenuItem from './MenuItem.vue'
import { getUniqueId } from '../utils'
import orderBy from 'lodash/orderBy'
import Fuse from 'fuse.js'

const ITEMS_PER_PAGE = 10
export default {
  name: 'Notebook',
  components: {
    MenuItem,
  },
  data() {
    return {
      shownRecord: undefined,
      notebookIcon: NotebookIcon,
      search: '',
      currentPage: 0,
    }
  },
  computed: {
    ...mapState({
      notebook: state => state.party.notebook,
    }),
    pages() {
      const numberOfPages = Math.ceil(this.records.length / ITEMS_PER_PAGE)
      return [...Array(numberOfPages).keys()].map(page =>
        this.records.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
      )
    },
    fuse() {
      return new Fuse(Object.values(this.notebook), {
        isCaseSensitive: false,
        includeScore: false,
        shouldSort: true,
        includeMatches: false,
        findAllMatches: false,
        minMatchCharLength: 1,
        threshold: 0.3,
        useExtendedSearch: false,
        ignoreLocation: true,
        ignoreFieldNorm: false,
        keys: ['title', 'text'],
      })
    },
    records() {
      if (this.search) {
        return this.fuse.search(this.search).map(result => result.item)
      }
      return orderBy(Object.values(this.notebook), 'createdAt', 'desc')
    },
  },
  mounted() {
    this.popupItem = this.$refs.notebook
  },
  methods: {
    ...mapActions('party', ['updateRecord', 'deleteRecord']),
    startRecordCreation() {
      this.shownRecord = {
        id: null,
        title: new Date().toDateString(),
        text: '',
      }
    },
    createRecord() {
      this.updateRecord({ ...this.shownRecord, id: getUniqueId() })
      this.shownRecord = undefined
    },
    openRecord(recordId) {
      this.shownRecord = this.notebook[recordId]
      this.$nextTick(() => {
        this.$refs.record.focus()
      })
    },
    closeRecord() {
      this.shownRecord = undefined
    },
    removeRecord() {
      this.deleteRecord(this.shownRecord.id)
      this.shownRecord = undefined
    },
    updateRecordTitle(title) {
      if (this.shownRecord.id === null) {
        this.shownRecord.title = title
        return
      }
      this.updateRecord({ ...this.notebook[this.shownRecord.id], title })
    },
    updateRecordText(text) {
      if (this.shownRecord.id === null) {
        this.shownRecord.text = text
        return
      }
      this.updateRecord({ ...this.notebook[this.shownRecord.id], text })
    },
  },
}
</script>

<style>
.notebook {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: flex-end;
}
.notebook-container {
  display: flex;
  flex-flow: column;
  align-items: center;
}
.notebook-search {
  width: 100%;
}
.notebook-record {
  display: flex;
  flex-flow: column;
}
.notebook-record > textarea {
  z-index: 1000;
  width: 100%;
  height: 20rem;
}
.notebook-add-record-button {
  margin-left: auto;
}
.notebook-records-list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
}
.notebook-records-list > li {
  width: 100%;
}
.notebook-records-list > li > span {
  width: 100%;
  display: block;
  text-align: center;
}
.record-control-button-container {
  display: flex;
  flex-flow: row;
}
.notebook-record-button {
  width: 100%;
}
.notebook-pagination {
  margin: 0.25rem 0 0.25rem 0;
}
.record-delete-button {
  margin-left: auto;
}
.record-date {
  font-size: 0.5rem;
  color: black;
}
</style>
