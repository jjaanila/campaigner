<template>
  <div class="sync">
    <button class="sync-button" title="Synchronization" @click="toggleSyncMenu">
      <img :src="syncIcon" />
    </button>
    <div v-if="isMenuOpen" class="sync-menu">
      <div class="sync-token-container">
        <label for="sync-token">JsonBin token</label>
        <input id="sync-token" :value="token" @input="token = $event.target.value" />
      </div>
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
import syncIcon from '../img/cycle.svg'
export default {
  name: 'Synchronization',
  data() {
    return {
      synchronizer: undefined,
      isMenuOpen: false,
      token: '',
      syncIcon,
    }
  },
  computed: {
    config() {
      return {
        storage: {
          type: 'jsonBin',
          config: {
            masterKey: this.token,
          },
        },
        manual: true,
        rotationIntervalMs: 15 * 60 * 1000,
        syncIntervalMs: 60 * 1000,
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
.sync {
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;
  margin-top: 0.5rem;
}
.sync-button {
  width: 3rem;
  height: 3rem;
  padding: 0 0.2rem 0 0.2rem;
}
.sync-token-container {
  display: flex;
  flex-flow: column;
  margin: 0;
}
.sync-menu {
  display: flex;
  flex-direction: column;
  background-color: #f7f2e5;
  margin: 0 0 0.5rem 0;
}
</style>
