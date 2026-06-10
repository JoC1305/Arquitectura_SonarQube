jest.mock('react', () => {
  const actualReact = jest.requireActual('react')
  const stateStore = []
  let cursor = 0

  const useState = jest.fn((initialValue) => {
    const stateIndex = cursor
    cursor += 1

    if (stateStore[stateIndex] === undefined) {
      stateStore[stateIndex] = initialValue
    }

    const setState = (value) => {
      stateStore[stateIndex] = typeof value === 'function' ? value(stateStore[stateIndex]) : value
    }

    return [stateStore[stateIndex], setState]
  })

  const useEffect = jest.fn((callback) => {
    callback()
  })

  return {
    ...actualReact,
    useState,
    useEffect,
    __resetHooks: () => {
      stateStore.length = 0
      cursor = 0
    },
    __resetCursor: () => {
      cursor = 0
    },
  }
})
