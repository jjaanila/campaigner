export class Storage {
  constructor(config) {
    this.config = config
  }

  initialize() {
    return Promise.resolve()
  }

  save(_id, _data) {
    throw new Error('Not implemented')
  }
}
