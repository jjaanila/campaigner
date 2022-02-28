export class Storage {
  constructor(config) {
    this.config = config
  }

  initialize() {
    return Promise.resolve()
  }

  getOne(_id) {
    throw new Error('Not implemented')
  }

  save(_id, _data) {
    throw new Error('Not implemented')
  }
}
