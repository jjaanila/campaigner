<template>
  <div class="synchronization">
    <button @click="toggleSyncMenu">Synchronization</button>
    <div v-if="isMenuOpen" class="synchronization-menu">
      <button @click="isSynchronizing ? stop() : start()">{{ isSynchronizing ? 'Stop' : 'Start' }}</button>
      <button title="Download current Campaigner state" @click.prevent="downloadState()">
        Download state
      </button>
      <button title="Load Campaigner state from disk" @click.prevent="openStateFileSelection()">
        Upload state
      </button>
      <input
        ref="stateFileInput"
        accept="application/json"
        type="file"
        name="state-file"
        style="display: none"
        @change="uploadState"
      />
    </div>
  </div>
</template>

<script>
import { Synchronizer } from '../sync'
export default {
  name: 'Synchronization',
  data() {
    return {
      synchronizer: undefined,
      isMenuOpen: false,
    }
  },
  computed: {
    config() {
      return {
        storage: {
          type: 'jsonBin',
          config: {
            masterKey: '',
          },
        },
        manual: true,
        rotationIntervalMs: 15 * 60 * 1000,
        syncIntervalMs: 15 * 60 * 1000,
        store: this.$store,
      }
    },
    isSynchronizing() {
      return this.synchronizer && this.synchronizer.isRunning
    },
  },
  methods: {
    start() {
      this.synchronizer = new Synchronizer(this.config)
      return this.synchronizer.start()
    },
    stop() {
      this.synchronizer.stop()
    },
    toggleSyncMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    openStateFileSelection() {
      this.$refs.stateFileInput.click()
    },
    downloadState() {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(
        new Blob([JSON.stringify({ party: this.party, combat: this.combat })], {
          type: 'text/plain',
        })
      )
      link.download = `campaigner-state-${new Date().toISOString()}.json`
      link.click()
      URL.revokeObjectURL(link.href)
    },
    uploadState(e) {
      e.target.files[0].text().then(stateText => {
        try {
          const state = JSON.parse(stateText)
          if (confirm('This will overwrite your current Campaigner state. Are you sure?')) {
            this.$store.replaceState({
              ...this.$store.state,
              ...state,
            })
          }
        } catch (err) {
          console.error(err)
          alert('Invalid state file')
          return
        }
      })
    },
  },
}
</script>

<style scoped>
.synchronization {
}
.synchronization-menu {
  display: flex;
  flex-direction: column;
  background-color: #f7f2e5;
  padding: 1rem;
  margin: 1rem 0;
}
</style>
