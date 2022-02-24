import { isInteger } from './validators'

export default class Dice {
  constructor(throws, sides, constant) {
    isInteger(throws)
    isInteger(sides)
    isInteger(constant)
    if (throws < 0 || sides < 0) {
      throw new Error(
        `Throws ${throws}, sides ${sides} must be non-negative integers and constant ${constant} integer.`
      )
    }
    this.throws = throws
    this.sides = sides
    this.constant = constant
  }

  get averageHitPoints() {
    return Math.floor((this.sides / 2 + 0.5) * this.throws) + this.constant
  }

  throwOnce() {
    return Math.round(Math.random() * (this.sides - 1) + 1)
  }

  throw() {
    if (this.throws === 0 || this.sides === 0) {
      return this.constant
    }
    return (
      Array(this.throws)
        .fill(null)
        .map(this.throwOnce.bind(this))
        .reduce((a, b) => a + b, 0) + this.constant
    )
  }

  toString() {
    if (!this.throws && !this.sides && this.constant) {
      return String(this.constant)
    }
    return `${this.averageHitPoints} (${this.throws}d${this.sides}${
      this.constant ? ` + ${this.constant}` : ''
    })`
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
