<template>
  <div class="synchronization">
    <button @click="synchronizer.synchronize()">Backup</button>
  </div>
</template>

<script>
import { Synchronizer } from '../sync'
export default {
  name: 'Synchronization',
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
    synchronizer() {
      const synchronizer = new Synchronizer(this.config)
      synchronizer.initialize()
      return synchronizer
    },
  },
}
</script>

<style></style>
