import { JsonBinStorage } from '../sync/JsonBinStorage'

const storageMap = Object.freeze({
  jsonBin: JsonBinStorage,
})

export class Synchronizer {
  constructor(config) {
    this.syncState = undefined
    this.config = {
      ...config,
      syncDebounceMs: config.syncDebounceMs ?? 5000,
    }
    this.storage = undefined
    this.lastRotateAt = undefined
    this.lastSyncAt = undefined
    this.isRunning = false
    this.isSynchronizing = false
    this.unsubscribe = undefined
    this.timeout = undefined
    this.currentId = undefined
  }

  getSyncState(state) {
    return {
      party: state.party,
      combat: state.combat,
    }
  }

  rotate() {
    this.currentId = `campaigner-state-${new Date().toISOString()}`
    this.lastRotateAt = new Date()
  }

  shouldRotate() {
    if (this.currentId === undefined || this.lastRotateAt === undefined) {
      return true
    }
    if (this.config.rotationIntervalMs === undefined) {
      return false
    }
    return new Date().getTime() - this.lastRotateAt.getTime() > this.config.rotationIntervalMs
  }

  shouldSynchronize() {
    if (this.config.syncIntervalMs === undefined || this.lastSyncAt === undefined) {
      return true
    }
    return new Date().getTime() - this.lastSyncAt.getTime() > this.config.syncIntervalMs
  }

  synchronize() {
    if (!this.shouldSynchronize()) {
      return
    }
    this.isSynchronizing = true
    if (this.shouldRotate()) {
      this.rotate()
    }
    console.info('Synchronizing...')
    return this.storage
      .save(this.currentId, this.syncState)
      .then(() => {
        console.info(`Synchronized ${this.currentId}`)
        this.lastSyncAt = new Date()
      })
      .catch(err => {
        console.error(`Synchronization of ${this.currentId} failed`, err)
      })
      .finally(() => {
        this.isSynchronizing = false
      })
  }

  scheduleSynchronization() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(() => {
      this.synchronize()
    }, this.config.syncDebounceMs)
  }

  onStoreUpdate(mutation, state) {
    if (!/^(party|combat)\//.test(mutation.type)) {
      return
    }
    this.syncState = this.getSyncState(state)
    this.scheduleSynchronization()
  }

  start() {
    const storageClass = storageMap[this.config?.storage?.type]
    if (!storageClass) {
      throw new Error(`Unknown storage type ${this.config?.storage?.type}`)
    }
    this.storage = new storageClass({
      ...this.config.storage.config,
    })
    return this.storage.initialize().then(() => {
      this.unsubscribe = this.config.store.subscribe(this.onStoreUpdate)
      this.isRunning = true
      console.info('Synchronizer started')
    })
  }

  stop() {
    this.isRunning = false
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    console.info('Synchronizer stopped')
  }
}
