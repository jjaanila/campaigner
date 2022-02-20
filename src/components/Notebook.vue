<template>
  <div class="notebook">
    <div>
      <button
        v-show="isNotebookOpen && !shownRecord"
        class="notebook-add-record-button"
        title="Add record"
        @click.stop="startRecordCreation()"
      >
        +
      </button>
      <button class="notebook-button" title="Notebook" @click.stop="toggleNotebook()">
        <img :src="notebookIcon" />
      </button>
    </div>
    <div v-show="isNotebookOpen" class="notebook-container">
      <input
        v-show="!shownRecord"
        class="notebook-search"
        placeholder="Search..."
        :value="search"
        @input="search = $event.target.value"
      />
      <ol v-show="!shownRecord" class="notebook-records-list">
        <li>
          <button
            v-for="record in records"
            :key="record.id"
            class="notebook-record-button"
            :title="record.title"
            @click.stop="openRecord(record.id)"
          >
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
          <button @click="createRecord()">Save</button>
          <button @click="closeRecord()">Close</button>
          <button v-show="shownRecord.id !== null" class="record-delete-button" @click="removeRecord()">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NotebookIcon from '../img/notebook.svg'
import ClickOutside from 'vue-click-outside'
import { getUniqueId } from '../utils'
export default {
  name: 'Notebook',
  directives: {
    ClickOutside,
  },
  data() {
    return {
      isNotebookOpen: false,
      shownRecord: undefined,
      notebookIcon: NotebookIcon,
      search: '',
      newRecord: undefined,
    }
  },
  computed: {
    ...mapState({
      notebook(state) {
        return state.party.notebook
      },
    }),
    records() {
      const records = Object.values(this.notebook)
      if (this.search) {
        return records.filter(record => record.title.toLowerCase().includes(this.search.toLowerCase()))
      }
      return records
    },
  },
  mounted() {
    this.popupItem = this.$refs.notebook
  },
  methods: {
    ...mapActions('party', ['updateRecord', 'deleteRecord']),
    toggleNotebook() {
      this.isNotebookOpen = !this.isNotebookOpen
    },
    closeNotebook() {
      this.isNotebookOpen = false
    },
    startRecordCreation() {
      this.shownRecord = {
        id: null,
        title: '',
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
.notebook-button {
  width: 3rem;
  height: 3rem;
  padding: 0 0.2rem 0 0.2rem;
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
.record-delete-button {
  margin-left: auto;
}
</style>
