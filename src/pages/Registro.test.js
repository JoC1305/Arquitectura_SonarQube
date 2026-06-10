jest.mock('../styles/pages/Auth.css', () => ({}), { virtual: true })

const mockNavigate = jest.fn()
const mockSignUp = jest.fn()
const mockInsert = jest.fn()

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children }) => children,
}))

jest.mock('../services/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: mockSignUp,
    },
    from: (table) => {
      if (table === 'usuarios') {
        return { insert: mockInsert }
      }
      throw new Error(`Tabla no mockeada: ${table}`)
    },
  },
}))

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

  return {
    ...actualReact,
    useState,
    __resetHooks: () => {
      stateStore.length = 0
      cursor = 0
    },
    __resetCursor: () => {
      cursor = 0
    },
  }
})

const React = require('react')
const Registro = require('./Registro.jsx').default

const renderComponent = () => {
  React.__resetCursor()
  return Registro()
}

const flattenChildren = (children) => {
  if (children === null || children === undefined) return []
  return Array.isArray(children) ? children : [children]
}

const findElement = (node, predicate) => {
  if (!node || typeof node !== 'object') return null
  if (predicate(node)) return node
  for (const child of flattenChildren(node.props?.children)) {
    const found = findElement(child, predicate)
    if (found) return found
  }
  return null
}

const findAllElements = (node, predicate, matches = []) => {
  if (!node || typeof node !== 'object') return matches
  if (predicate(node)) matches.push(node)
  for (const child of flattenChildren(node.props?.children)) {
    findAllElements(child, predicate, matches)
  }
  return matches
}

beforeEach(() => {
  React.__resetHooks()
  mockNavigate.mockReset()
  mockSignUp.mockReset()
  mockInsert.mockReset()
  global.alert = jest.fn()
})

test('renderiza el formulario de registro con todos los campos requeridos', () => {
  const rendered = renderComponent()

  const nombreInput = findElement(rendered, (node) => node.type === 'input' && node.props.name === 'nombre')
  const emailInput = findElement(rendered, (node) => node.type === 'input' && node.props.name === 'email')
  const passwordInput = findElement(rendered, (node) => node.type === 'input' && node.props.name === 'password')
  const confirmPasswordInput = findElement(rendered, (node) => node.type === 'input' && node.props.name === 'confirmPassword')
  const submitButton = findElement(rendered, (node) => node.type === 'button' && node.props.type === 'submit')

  expect(nombreInput).toBeTruthy()
  expect(emailInput).toBeTruthy()
  expect(passwordInput).toBeTruthy()
  expect(confirmPasswordInput).toBeTruthy()
  expect(submitButton).toBeTruthy()
})

test('muestra errores si el email es inválido, contraseña débil o confirmación no coincide', async () => {
  const firstRender = renderComponent()
  const emailInput = findElement(firstRender, (node) => node.type === 'input' && node.props.name === 'email')
  const passwordInput = findElement(firstRender, (node) => node.type === 'input' && node.props.name === 'password')
  const confirmPasswordInput = findElement(firstRender, (node) => node.type === 'input' && node.props.name === 'confirmPassword')

  emailInput.props.onChange({ target: { name: 'email', value: 'correo-invalido' } })
  passwordInput.props.onChange({ target: { name: 'password', value: 'abc' } })
  confirmPasswordInput.props.onChange({ target: { name: 'confirmPassword', value: 'abcd' } })

  const secondRender = renderComponent()
  const form = findElement(secondRender, (node) => node.type === 'form')

  await form.props.onSubmit({ preventDefault: jest.fn() })

  const thirdRender = renderComponent()
  const errorNodes = findAllElements(thirdRender, (node) => node.props?.className === 'error-text')
  const errorMessages = errorNodes.map((node) => node.props.children)

  expect(errorMessages).toContain('Por favor, ingresa un email válido')
  expect(errorMessages).toContain('La contraseña debe tener al menos 6 caracteres')
  expect(errorMessages).toContain('Las contraseñas no coinciden')
  expect(mockSignUp).not.toHaveBeenCalled()
  expect(mockInsert).not.toHaveBeenCalled()
  expect(mockNavigate).not.toHaveBeenCalled()
})

test('registra un usuario con éxito y navega a inicio de sesión', async () => {
  mockSignUp.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null })
  mockInsert.mockResolvedValue({ error: null })

  const firstRender = renderComponent()
  const nombreInput = findElement(firstRender, (node) => node.type === 'input' && node.props.name === 'nombre')
  const emailInput = findElement(firstRender, (node) => node.type === 'input' && node.props.name === 'email')
  const passwordInput = findElement(firstRender, (node) => node.type === 'input' && node.props.name === 'password')
  const confirmPasswordInput = findElement(firstRender, (node) => node.type === 'input' && node.props.name === 'confirmPassword')

  nombreInput.props.onChange({ target: { name: 'nombre', value: 'Usuario Prueba' } })
  emailInput.props.onChange({ target: { name: 'email', value: 'usuario@test.com' } })
  passwordInput.props.onChange({ target: { name: 'password', value: 'Password123' } })
  confirmPasswordInput.props.onChange({ target: { name: 'confirmPassword', value: 'Password123' } })

  const secondRender = renderComponent()
  const form = findElement(secondRender, (node) => node.type === 'form')

  await form.props.onSubmit({ preventDefault: jest.fn() })

  expect(mockSignUp).toHaveBeenCalledWith({
    email: 'usuario@test.com',
    password: 'Password123',
  })
  expect(mockInsert).toHaveBeenCalledWith([
    {
      id: 'user-123',
      nombre: 'Usuario Prueba',
      email: 'usuario@test.com',
    },
  ])
  expect(global.alert).toHaveBeenCalledWith('¡Registro exitoso! Por favor, verifica tu email para confirmar tu cuenta.')
  expect(mockNavigate).toHaveBeenCalledWith('/inicio-sesion')
})

test('muestra error general cuando signUp falla', async () => {
  mockSignUp.mockResolvedValue({ data: null, error: { message: 'El correo ya está en uso' } })

  const firstRender = renderComponent()
  const nombreInput = findElement(firstRender, (node) => node.type === 'input' && node.props.name === 'nombre')
  const emailInput = findElement(firstRender, (node) => node.type === 'input' && node.props.name === 'email')
  const passwordInput = findElement(firstRender, (node) => node.type === 'input' && node.props.name === 'password')
  const confirmPasswordInput = findElement(firstRender, (node) => node.type === 'input' && node.props.name === 'confirmPassword')

  nombreInput.props.onChange({ target: { name: 'nombre', value: 'Usuario Prueba' } })
  emailInput.props.onChange({ target: { name: 'email', value: 'usuario@test.com' } })
  passwordInput.props.onChange({ target: { name: 'password', value: 'Password123' } })
  confirmPasswordInput.props.onChange({ target: { name: 'confirmPassword', value: 'Password123' } })

  const secondRender = renderComponent()
  const form = findElement(secondRender, (node) => node.type === 'form')

  await form.props.onSubmit({ preventDefault: jest.fn() })

  const thirdRender = renderComponent()
  const errorAlert = findElement(thirdRender, (node) => node.props?.className === 'alert alert-error')

  expect(mockSignUp).toHaveBeenCalled()
  expect(mockInsert).not.toHaveBeenCalled()
  expect(errorAlert).toBeTruthy()
  expect(errorAlert.props.children).toBe('El correo ya está en uso')
  expect(mockNavigate).not.toHaveBeenCalled()
})
