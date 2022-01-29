import { isInteger } from './validators'

export default class Dice {
  constructor(numberOfThrows, numberOfDiceSides, constant) {
    isInteger(numberOfThrows)
    isInteger(numberOfDiceSides)
    isInteger(constant)
    this.numberOfThrows = numberOfThrows
    this.numberOfDiceSides = numberOfDiceSides
    this.constant = constant
  }

  get averageHitPoints() {
    return Math.floor((this.numberOfDiceSides / 2 + 0.5) * this.numberOfThrows) + this.constant
  }

  toString() {
    return `${this.averageHitPoints} (${this.numberOfThrows}d${this.numberOfDiceSides} + ${this.constant})`
  }
}
