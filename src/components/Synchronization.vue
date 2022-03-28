<script setup>
import { Synchronizer } from '../sync'
import syncIcon from '../img/cycle.svg'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const synchronizer = ref()
const isMenuOpen = ref(false)
const token = ref('')
const stateFileInput = ref()
const config = computed(() => {
  return {
    storage: {
      type: 'jsonBin',
      config: {
        masterKey: token,
      },
    },
    manual: true,
    rotationIntervalMs: 15 * 60 * 1000,
    syncIntervalMs: 60 * 1000,
    store,
  }
})
const isSynchronizing = computed(() => {
  return synchronizer.value && synchronizer.value.isSynchronizing
})
const isRunning = computed(() => {
  return synchronizer.value && synchronizer.value.isRunning
})
const isStarting = computed(() => {
  return synchronizer.value && synchronizer.value.isStarting
})

const start = () => {
  synchronizer.value = new Synchronizer(config.value)
  return synchronizer.value.start()
}
const stop = () => {
  synchronizer.value.stop()
}
const toggleSyncMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const openStateFileSelection = () => {
  stateFileInput.value.click()
}
const downloadState = () => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(
    new Blob([JSON.stringify({ party: store.state.party, combat: store.state.combat })], {
      type: 'text/plain',
    })
  )
  link.download = `campaigner-state-${new Date().toISOString()}.json`
  link.click()
  URL.revokeObjectURL(link.href)
}
const uploadState = e => {
  e.target.files[0].text().then(stateText => {
    try {
      const state = JSON.parse(stateText)
      if (confirm('This will overwrite your current Campaigner state. Are you sure?')) {
        store.replaceState({
          ...store.state,
          ...state,
        })
      }
    } catch (err) {
      console.error(err)
      alert('Invalid state file')
      return
    }
  })
}
</script>

<template>
  <div class="sync">
    <button class="sync-button" title="Synchronization" @click="toggleSyncMenu">
      <img :class="{ spin: isSynchronizing }" :src="syncIcon" />
      <div :class="{ 'sync-status': true, running: isRunning }" />
    </button>
    <div v-if="isMenuOpen" class="sync-menu">
      <div class="sync-token-container">
        <label for="sync-token">JsonBin token</label>
        <input id="sync-token" type="password" :value="token" @input="token = $event.target.value" />
      </div>
      <button :disabled="isStarting" @click="isRunning ? stop() : start()">
        {{ isRunning ? 'Stop' : 'Start' }}
      </button>
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

<style scoped>
.sync {
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;
  margin-top: 0.5rem;
}
.sync-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
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
.sync-status {
  position: absolute;
  top: calc(50% - 0.25rem);
  left: calc(50% - 0.25rem);
  width: 0.5rem;
  height: 0.5rem;
  background: red;
  border-radius: 50%;
}

.sync-status.running {
  background: lightgreen;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation-name: spin;
  animation-duration: 3000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
</style>
