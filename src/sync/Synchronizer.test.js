import { Synchronizer } from './Synchronizer'
import { JsonBinStorage } from './JsonBinStorage'

const mockInitialize = jest.fn().mockResolvedValue()
const mockSave = jest.fn().mockResolvedValue()
jest.mock('./JsonBinStorage', () => ({
  JsonBinStorage: jest.fn().mockImplementation(() => {
    return { initialize: mockInitialize, save: mockSave }
  }),
}))

jest.spyOn(console, 'info').mockImplementation()
const setTimeoutSpy = jest.spyOn(global, 'setTimeout')
const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

describe('Synchronizer', function () {
  let synchronizer
  let mockUnsubcribe = jest.fn()
  let mockSubscribe = jest.fn().mockImplementation(() => mockUnsubcribe)
  beforeEach(function () {
    synchronizer = new Synchronizer({
      syncIntervalMs: 60 * 1000,
      rotationIntervalMs: 5000,
      storage: {
        type: 'jsonBin',
      },
      store: {
        subscribe: mockSubscribe,
      },
    })
    JsonBinStorage.mockClear()
    mockInitialize.mockClear()
    mockSave.mockClear()
    mockSubscribe.mockClear()
    mockUnsubcribe.mockClear()
    setTimeoutSpy.mockClear()
    clearTimeoutSpy.mockClear()
  })

  afterEach(async () => {
    await synchronizer.stop()
  })

  describe('start', () => {
    it('should throw for unknown storage type', () => {
      const synchronizer = new Synchronizer({
        storage: {
          type: 'unknown',
        },
      })
      expect(() => synchronizer.start()).toThrow('Unknown storage type')
    })
    it('should start synchronizer', async () => {
      await synchronizer.start()
      expect(synchronizer.isRunning).toEqual(true)
      expect(mockSubscribe).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  describe('stop', () => {
    it('should stop synchronizer and tear down scheduled sync', async () => {
      await synchronizer.start()
      synchronizer.scheduleSynchronization()
      await synchronizer.stop()
      expect(synchronizer.isRunning).toEqual(false)
      expect(mockUnsubcribe).toHaveBeenCalled()
      expect(clearTimeoutSpy).toHaveBeenCalledWith(synchronizer.timeout)
    })

    it('should stop synchronizer without scheduled sync', async () => {
      await synchronizer.start()
      await synchronizer.stop()
      expect(synchronizer.isRunning).toEqual(false)
      expect(mockUnsubcribe).toHaveBeenCalled()
      expect(clearTimeoutSpy).not.toHaveBeenCalled()
    })

    it('should do nothing if not started before', async () => {
      await synchronizer.stop()
      expect(synchronizer.isRunning).toEqual(false)
      expect(mockUnsubcribe).not.toHaveBeenCalled()
      expect(clearTimeoutSpy).not.toHaveBeenCalled()
    })
  })

  describe('onStoreUpdate', () => {
    it('should do nothing for other than updates on correct store modules', async () => {
      synchronizer.onStoreUpdate({ type: 'ui/update' }, { key: 'value' })
      expect(clearTimeoutSpy).not.toHaveBeenCalled()
      expect(setTimeoutSpy).not.toHaveBeenCalled()
    })

    it('should schedule sync only if store module is correct', async () => {
      synchronizer.onStoreUpdate({ type: 'party/update' }, { key: 'value' })
      expect(clearTimeoutSpy).not.toHaveBeenCalled()
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), synchronizer.config.syncDebounceMs)
      setTimeoutSpy.mockClear()
      clearTimeoutSpy.mockClear()

      synchronizer.onStoreUpdate({ type: 'ui/update' }, { key: 'value' })
      expect(clearTimeoutSpy).not.toHaveBeenCalled()
      expect(setTimeoutSpy).not.toHaveBeenCalled()
      setTimeoutSpy.mockClear()
      clearTimeoutSpy.mockClear()

      synchronizer.onStoreUpdate({ type: 'combat/update' }, { key: 'value' })
      expect(clearTimeoutSpy).toHaveBeenCalled()
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), synchronizer.config.syncDebounceMs)
    })
  })

  describe('synchronize', () => {
    beforeEach(async () => {
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01T01:01:00Z').getTime())
      await synchronizer.start()
    })

    afterEach(async () => {
      jest.useRealTimers()
    })

    it('should synchronize if syncIntervalMs is not defined ', async () => {
      synchronizer.config.syncIntervalMs = undefined
      synchronizer.config.storage = { type: 'jsonBin' }
      synchronizer.config.store = {
        subscribe: mockSubscribe,
      }
      await synchronizer.start()
      synchronizer.lastSyncAt = new Date()
      await synchronizer.synchronize()
      expect(mockSave).toHaveBeenCalled()
    })

    it('should synchronize if never synced', async () => {
      synchronizer.lastSyncAt = undefined
      synchronizer.syncState = { key: 'value' }
      await synchronizer.synchronize()
      expect(mockSave).toHaveBeenCalledWith('campaigner-state-2020-01-01T01:01:00.000Z', { key: 'value' })
      expect(synchronizer.lastSyncAt).toEqual(expect.any(Date))
    })

    it('should synchronize if last sync was over syncIntervalMs ago', async () => {
      synchronizer.lastSyncAt = new Date('2020-01-01T00:59:59Z')
      synchronizer.syncState = { key: 'value' }
      await synchronizer.synchronize()
      expect(mockSave).toHaveBeenCalledWith('campaigner-state-2020-01-01T01:01:00.000Z', { key: 'value' })
      expect(synchronizer.lastSyncAt).toEqual(expect.any(Date))
    })

    it('should skip synchronization if last sync was less than syncIntervalMs ago', async () => {
      synchronizer.lastSyncAt = new Date('2020-01-01T01:00:30Z')
      await synchronizer.synchronize()
      expect(mockSave).not.toHaveBeenCalled()
    })

    it.each([
      [undefined, undefined, 1000],
      ['initial-id', undefined, 1000],
      [undefined, new Date('2020-01-01T01:00:59Z'), 1000],
      ['initial-id', new Date('2020-01-01T01:00:58Z'), 1000],
    ])(
      'should rotate if currentId: %s, lastRotateAt: %s, rotationIntervalMs: %s',
      async (currentId, lastRotateAt, rotationIntervalMs) => {
        synchronizer.currentId = currentId
        synchronizer.lastRotateAt = lastRotateAt
        synchronizer.config.rotationIntervalMs = rotationIntervalMs
        await synchronizer.synchronize()
        expect(mockSave).toHaveBeenCalledWith('campaigner-state-2020-01-01T01:01:00.000Z', undefined)
        expect(synchronizer.currentId).toEqual('campaigner-state-2020-01-01T01:01:00.000Z')
        expect(synchronizer.lastRotateAt).not.toBe(lastRotateAt)
        expect(synchronizer.lastRotateAt).toEqual(expect.any(Date))
      }
    )
  })
})
