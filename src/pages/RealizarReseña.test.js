jest.mock('../styles/pages/RealizarReseña.css', () => ({}), { virtual: true })

const mockNavigate = jest.fn()
const mockGetUser = jest.fn()
const mockInsert = jest.fn().mockResolvedValue({ error: null })
const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null })
const mockSelect = jest.fn(() => ({ order: mockOrder }))
const mockFrom = jest.fn((table) => {
  if (table === 'juegos') {
    return { select: mockSelect }
  }

  if (table === 'resenas') {
    return { insert: mockInsert }
  }

  throw new Error(`Tabla no mockeada: ${table}`)
})

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

jest.mock('../services/supabaseClient', () => ({
  supabase: {
    from: mockFrom,
    auth: {
      getUser: mockGetUser,
    },
  },
}))

require('../testUtils/reactMock')

const React = require('react')
const RealizarReseña = require('./RealizarReseña.jsx').default

const renderComponent = () => {
  React.__resetCursor()
  return RealizarReseña()
}

const { flattenChildren, findElement } = require('../testUtils/domHelpers')

beforeEach(() => {
  React.__resetHooks()
  mockNavigate.mockReset()
  mockGetUser.mockReset()
  mockInsert.mockClear()
  mockOrder.mockClear()
  mockSelect.mockClear()
  mockFrom.mockClear()
})

test('muestra un error de validación y evita enviar una reseña demasiado corta', async () => {
  const firstRender = renderComponent()
  const textarea = findElement(firstRender, (node) => node.type === 'textarea' && node.props.name === 'comentario')
  const form = findElement(firstRender, (node) => node.type === 'form')

  expect(textarea).toBeTruthy()
  expect(form).toBeTruthy()

  textarea.props.onChange({ target: { name: 'comentario', value: 'muy corta' } })

  const secondRender = renderComponent()
  const validationMessage = findElement(secondRender, (node) => node.props?.className === 'error-text')

  expect(validationMessage.props.children).toBe('La reseña debe tener al menos 5 palabras.')

  await form.props.onSubmit({ preventDefault: jest.fn() })

  expect(mockGetUser).not.toHaveBeenCalled()
  expect(mockInsert).not.toHaveBeenCalled()
  expect(mockNavigate).not.toHaveBeenCalled()
})