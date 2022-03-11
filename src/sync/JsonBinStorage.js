import { Storage } from './Storage'

export class JsonBinStorage extends Storage {
  constructor(config) {
    super()
    if (!config.masterKey) {
      throw new Error('JsonBinStorage requires a masterKey')
    }
    this.masterKey = config.masterKey
    this.currentBinId = undefined
    this.collectionId = undefined
    this.CAMPAIGNER_COLLECTION_NAME = 'campaigner'
    this.API_URL = 'https://api.jsonbin.io'
  }

  fetch(url, init = {}) {
    return fetch(url, {
      method: 'GET',
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Master-key': this.masterKey,
        ...init.headers,
      },
    })
  }

  initialize() {
    return this.fetch(`${this.API_URL}/v3/c`)
      .then(response => response.json())
      .then(collections => {
        const campaignerCollection = collections.find(
          collection => collection.collectionMeta.name === this.CAMPAIGNER_COLLECTION_NAME
        )
        if (campaignerCollection) {
          this.collectionId = campaignerCollection.record
          return
        }
        return this.createCollection()
      })
  }

  createCollection() {
    return this.fetch(`${this.API_URL}/v3/c`, {
      method: 'POST',
      headers: {
        'X-Collection-Name': this.CAMPAIGNER_COLLECTION_NAME,
      },
    })
      .then(response => response.json())
      .then(collection => {
        this.collectionId = collection.record
      })
  }

  readPage() {
    return this.fetch(`${this.API_URL}/v3/c/${this.collectionId}/bins`).then(response => response.json())
  }

  readOne(id) {
    return this.fetch(`${this.API_URL}/v3/b/${id}`).then(response => response.json())
  }

  /**
   * Saves a document to JsonBin.
   * @param {string} name
   * @param {Object} data
   */
  save(name, data) {
    if (!this.currentBinId) {
      return this.fetch(`${this.API_URL}/v3/b`, {
        method: 'POST',
        headers: {
          'X-Collection-Id': this.collectionId,
          'X-Bin-Private': true,
          'X-Bin-Name': name,
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(bin => {
          this.currentBinId = bin.metadata.id
        })
    }
    return this.fetch(`${this.API_URL}/v3/b/${this.currentBinId}`, {
      method: 'PUT',
      headers: {
        'X-Collection-Id': this.collectionId,
        'X-Bin-Private': true,
        'X-Bin-Name': name,
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        return data
      })
  }
}
