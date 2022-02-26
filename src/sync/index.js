const rotateInterval = 15 * 60 * 1000
let storage = null
let lastRotateAt = null
let currentId = null
const queue = []

const rotate = () => {
  lastRotateAt = new Date()
  currentId = `campaigner-state-${lastRotateAt.toISOString()}`
  console.info(`Rotated to ${currentId}`)
}

export const getSyncState = state => {
  return {
    party: state.party,
    combat: state.combat,
  }
}

export const synchronize = () => {
  console.info('Synchronizing...')
  if (lastRotateAt + rotateInterval < new Date()) {
    rotate()
  }
  const latestState = queue.pop()
  queue.length = 0
  return storage
    .save(currentId, getSyncState(latestState))
    .then(() => {
      console.info(`Synchronized ${currentId}`)
    })
    .catch(err => {
      console.error(`Synchronization of ${currentId} failed`, err)
    })
}

export const initialize = (store, storageObject) => {
  if (!storageObject) {
    return
  }
  storage = storageObject
  store.subscribe((mutation, state) => {
    if (!/^(party|combat)\//.test(mutation.type)) {
      return
    }
    queue.push(state)
    synchronize() // TODO: This needs to be queued
  })
}
