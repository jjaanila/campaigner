import { JsonBinStorage } from '../sync/JsonBinStorage'

const storageMap = Object.freeze({
  jsonBin: JsonBinStorage,
})

export class Synchronizer {
  constructor(config) {
    this.queue = []
    this.config = { ...config }
    this.storage = undefined
    this.lastRotateAt = undefined
    this.lastSyncAt = undefined
    this.isRunning = false
    this.unsubscribe = undefined
  }

  getSyncState(state) {
    return {
      party: state.party,
      combat: state.combat,
    }
  }

  rotate() {
    this.currentId = undefined
    this.lastRotateAt = new Date()
  }

  shouldRotate() {
    if (this.config.rotationIntervalMs === undefined) {
      return false
    }
    if (this.lastRotateAt === undefined) {
      return true
    }
    return new Date().getTime() - this.lastRotateAt.getTime() > this.config.rotationIntervalMs
  }

  shouldSynchronize() {
    if (this.config.syncIntervalMs === undefined || this.lastSyncAt === undefined) {
      return true
    }
    return new Date().getTime() - this.lastSyncAt.getTime() > this.config.syncIntervalMs
  }

  synchronize(storage) {
    if (!this.shouldSynchronize()) {
      return
    }
    if (this.shouldRotate()) {
      this.rotate()
    }
    console.info('Synchronizing...')
    const latestState = this.queue.pop()
    this.queue.length = 0
    const id = `campaigner-state-${new Date().toISOString()}`
    return storage
      .save(id, this.getSyncState(latestState))
      .then(() => {
        console.info(`Synchronized ${id}`)
        this.lastSyncAt = new Date()
      })
      .catch(err => {
        console.error(`Synchronization of ${id} failed`, err)
      })
  }

  start() {
    if (this.config?.storage?.type === undefined) {
      return
    }
    const storageClass = storageMap[this.config?.storage?.type]
    if (!storageClass) {
      throw new Error(`Unknown storage type ${this.config?.storage?.type}`)
    }
    this.storage = new storageClass({
      ...this.config.storage.config,
    })
    return this.storage.initialize().then(() => {
      this.unsubscribe = this.config.store.subscribe((mutation, state) => {
        if (!/^(party|combat)\//.test(mutation.type)) {
          return
        }
        this.queue.push(state)
        this.synchronize(this.storage) // TODO: This needs to be queued
      })
      this.isRunning = true
    })
  }

  stop() {
    this.isRunning = false
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
