import { isInteger } from './validators'

export default class Dice {
  constructor(throws, sides, constant) {
    isInteger(throws)
    isInteger(sides)
    isInteger(constant)
    this.throws = throws
    this.sides = sides
    this.constant = constant
  }

  get averageHitPoints() {
    return Math.floor((this.sides / 2 + 0.5) * this.throws) + this.constant
  }

  toString() {
    if (!this.throws && !this.sides && this.constant) {
      return String(this.constant)
    }
    return `${this.averageHitPoints} (${this.throws}d${this.sides} + ${this.constant})`
  }

  static deserialize(serializedDice) {
    return new Dice(serializedDice.throws, serializedDice.sides, serializedDice.constant)
  }

  serialize() {
    return {
      throws: this.throws,
      sides: this.sides,
      constant: this.constant,
    }
  }
}
