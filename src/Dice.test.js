import 'jest'
import Dice from './Dice'

describe('Dice', () => {
  it.each([
    [1, 6, 0],
    [10, 10, 10],
    [30, 20, 10],
  ])(`should construct object with: throws: %i, sides: %i, constant: %i`, (throws, sides, constant) => {
    const dice = new Dice(throws, sides, constant)
    expect(dice.throws).toEqual(throws)
    expect(dice.sides).toEqual(sides)
    expect(dice.constant).toEqual(constant)
  })

  it.each([
    [-1, 0, 0],
    [0, -1, 0],
    [0.5, 0.5, 0.5],
  ])(`should throw: throws: %i, sides: %i, constant: %i`, (throws, sides, constant) => {
    expect(() => new Dice(throws, sides, constant)).toThrow(
      Error(
        `Throws ${throws} and sides ${sides} must be non-negative integers and constant ${constant} integer.`
      )
    )
  })

  describe('averageHitPoints', () => {
    it.each([
      [1, 6, 0, 3],
      [1, 6, 1, 4],
      [4, 4, 1, 11],
    ])(
      `should return average result: throws %i, sides: %i, constant: %i, expected average: %i`,
      (throws, sides, constant, expected) => {
        const dice = new Dice(throws, sides, constant)
        expect(dice.averageHitPoints).toEqual(expected)
      }
    )
  })

  describe('toString', () => {
    it.each([
      [1, 6, 0, '3 (1d6)'],
      [1, 6, 1, '4 (1d6 + 1)'],
      [4, 4, 1, '11 (4d4 + 1)'],
    ])(
      `should return string version: throws %i, sides: %i, constant: %i`,
      (throws, sides, constant, expected) => {
        const dice = new Dice(throws, sides, constant)
        expect(dice.toString()).toEqual(expected)
      }
    )
  })

  describe('throw', () => {
    beforeEach(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.5)
    })
    afterEach(() => {
      jest.spyOn(global.Math, 'random').mockRestore()
    })
    it.each([
      [1, 6, 0, 4],
      [1, 6, 1, 5],
      [10, 20, 1, 111],
    ])(
      `should return randomized value: throws %i, sides: %i, constant: %i, expected: %i`,
      (throws, sides, constant, expected) => {
        const dice = new Dice(throws, sides, constant, expected)
        expect(dice.throw()).toEqual(expected)
      }
    )
  })
})
