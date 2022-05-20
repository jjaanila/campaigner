import { createStore } from 'vuex'
import getUIModule from './ui.store'
import Dice from '../Dice'

describe('ui.store', () => {
  describe('initialization', () => {
    afterEach(() => {
      global.localStorage = undefined
    })

    it('should initialize without existing state', () => {
      global.localStorage = {
        getItem: jest.fn().mockImplementation(() => null),
      }
      const store = createStore({
        modules: {
          ui: getUIModule(),
        },
      })
      expect(store.state.ui).toEqual({
        isToCOpen: true,
        showToCAlways: true,
        isCombatOverlayOpen: false,
        hideToC: false,
        hideParty: false,
        hideDice: false,
        dice: {
          throws: 1,
          history: [],
        },
      })
    })

    it('should initialize using localStorage', () => {
      global.localStorage = {
        getItem: jest.fn().mockImplementation(() =>
          JSON.stringify({
            isToCOpen: true,
            showToCAlways: true,
            isCombatOverlayOpen: false,
            hideToC: false,
            hideParty: false,
            hideDice: false,
            dice: {
              throws: 1,
              history: [{ id: '123', result: 13, dice: { throws: 1, sides: 20, constant: 0 } }],
            },
          })
        ),
      }
      const store = createStore({
        modules: {
          ui: getUIModule(),
        },
      })
      expect(store.state.ui).toEqual({
        isToCOpen: true,
        showToCAlways: true,
        isCombatOverlayOpen: false,
        hideToC: false,
        hideParty: false,
        hideDice: false,
        dice: {
          throws: 1,
          history: [{ id: '123', result: 13, dice: new Dice(1, 20, 0) }],
        },
      })
    })

    it('should migrate state to new version', () => {
      global.localStorage = {
        getItem: jest.fn().mockImplementation(() =>
          JSON.stringify({
            isToCOpen: true,
            showToCAlways: true,
            isCombatOverlayOpen: false,
            dice: {
              throws: 1,
              history: [],
            },
          })
        ),
      }
      const store = createStore({
        modules: {
          ui: getUIModule(),
        },
      })
      expect(store.state.ui).toEqual({
        isToCOpen: true,
        showToCAlways: true,
        isCombatOverlayOpen: false,
        hideToC: false,
        hideParty: false,
        hideDice: false,
        dice: {
          throws: 1,
          history: [],
        },
      })
    })
  })
})
