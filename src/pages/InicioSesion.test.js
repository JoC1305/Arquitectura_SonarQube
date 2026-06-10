jest.mock('../styles/pages/Auth.css', () => ({}), { virtual: true })

const mockNavigate = jest.fn()
const mockSignInWithPassword = jest.fn()
const mockResetPasswordForEmail = jest.fn()

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children }) => children,
}))

jest.mock('../services/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      resetPasswordForEmail: mockResetPasswordForEmail,
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
const InicioSesion = require('./InicioSesion.jsx').default

const renderComponent = () => {
  React.__resetCursor()
  return InicioSesion()
}

const flattenChildren = (children) => {
  if (children === null || children === undefined) {
    return []
  }
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

const getInput = (rendered, name) => findElement(rendered, (node) => node.type === 'input' && node.props.name === name)
const getForm = (rendered) => findElement(rendered, (node) => node.type === 'form')
const getButton = (rendered, type) => findElement(rendered, (node) => node.type === 'button' && node.props.type === type)
const getForgotPasswordButton = (rendered) => findElement(rendered, (node) => node.type === 'button' && typeof node.props.children === 'string' && node.props.children.includes('Olvidaste'))
const getErrorText = (rendered) => findElement(rendered, (node) => node.props?.className === 'error-text')
const getAlert = (rendered, className) => findElement(rendered, (node) => node.props?.className === className)
const getAllErrorMessages = (rendered) => findAllElements(rendered, (node) => node.props?.className === 'error-text').map((node) => node.props.children)

const fillForm = (rendered, values) => {
  Object.entries(values).forEach(([name, value]) => {
    const input = getInput(rendered, name)
    if (input) input.props.onChange({ target: { name, value } })
  })
}

const submitForm = async (rendered) => {
  const form = getForm(rendered)
  await form.props.onSubmit({ preventDefault: jest.fn() })
}

const clickForgotPassword = async (rendered) => {
  const button = getForgotPasswordButton(rendered)
  await button.props.onClick()
}

beforeEach(() => {
  React.__resetHooks()
  mockNavigate.mockReset()
  mockSignInWithPassword.mockReset()
  mockResetPasswordForEmail.mockReset()
  if (!globalThis.location) {
    globalThis.location = { origin: 'http://localhost' }
  }
})

test('renderiza el formulario de inicio de sesión con email, password y botones', () => {
  const rendered = renderComponent()

  const emailInput = getInput(rendered, 'email')
  const passwordInput = getInput(rendered, 'password')
  const submitButton = getButton(rendered, 'submit')
  const forgotPasswordButton = getForgotPasswordButton(rendered)

  expect(emailInput).toBeTruthy()
  expect(passwordInput).toBeTruthy()
  expect(submitButton).toBeTruthy()
  expect(forgotPasswordButton).toBeTruthy()
})

test('muestra error de email inválido y no intenta iniciar sesión', async () => {
  const firstRender = renderComponent()
  fillForm(firstRender, { email: 'correo-invalido' })

  const secondRender = renderComponent()
  await submitForm(secondRender)

  const errorMessage = getErrorText(secondRender)

  expect(errorMessage).toBeTruthy()
  expect(errorMessage.props.children).toBe('Por favor, ingresa un email válido')
  expect(mockSignInWithPassword).not.toHaveBeenCalled()
  expect(mockNavigate).not.toHaveBeenCalled()
  expect(getButton(secondRender, 'submit').props.disabled).toBe(false)
})

test('inicia sesión correctamente y navega a la página principal', async () => {
  mockSignInWithPassword.mockResolvedValue({ error: null })

  const firstRender = renderComponent()
  fillForm(firstRender, { email: 'usuario@test.com', password: 'Password123' })

  const secondRender = renderComponent()
  await submitForm(secondRender)

  expect(mockSignInWithPassword).toHaveBeenCalledWith({
    email: 'usuario@test.com',
    password: 'Password123',
  })
  expect(mockNavigate).toHaveBeenCalledWith('/')
})

test('muestra mensaje general cuando supabase devuelve error', async () => {
  mockSignInWithPassword.mockResolvedValue({ error: { message: 'Credenciales incorrectas' } })

  const firstRender = renderComponent()
  fillForm(firstRender, { email: 'usuario@test.com', password: 'Password123' })

  const secondRender = renderComponent()
  await submitForm(secondRender)

  const thirdRender = renderComponent()
  const alert = getAlert(thirdRender, 'alert alert-error')

  expect(mockSignInWithPassword).toHaveBeenCalled()
  expect(alert).toBeTruthy()
  expect(alert.props.children).toBe('Credenciales incorrectas')
  expect(mockNavigate).not.toHaveBeenCalled()
})

test('muestra error de email inválido al restablecer contraseña', async () => {
  const firstRender = renderComponent()
  fillForm(firstRender, { email: 'correo-invalido' })

  const secondRender = renderComponent()
  clickForgotPassword(secondRender)

  const thirdRender = renderComponent()
  const errorMessage = getErrorText(thirdRender)

  expect(errorMessage).toBeTruthy()
  expect(errorMessage.props.children).toBe('Por favor, ingresa un email válido')
  expect(mockResetPasswordForEmail).not.toHaveBeenCalled()
})

test('envía solicitud de restablecer contraseña con email válido', async () => {
  mockResetPasswordForEmail.mockResolvedValue({ error: null })

  const firstRender = renderComponent()
  fillForm(firstRender, { email: 'usuario@test.com' })

  const secondRender = renderComponent()
  await clickForgotPassword(secondRender)

  expect(mockResetPasswordForEmail).toHaveBeenCalledWith('usuario@test.com', {
    redirectTo: 'http://localhost/restablecer-contraseña',
  })

  const thirdRender = renderComponent()
  const successAlert = getAlert(thirdRender, 'alert alert-success')

  expect(successAlert).toBeTruthy()
  expect(successAlert.props.children).toBe('Se envió un correo con instrucciones para restablecer tu contraseña.')
})

test('muestra error general cuando resetPasswordForEmail falla', async () => {
  mockResetPasswordForEmail.mockResolvedValue({ error: { message: 'No se pudo enviar el correo de recuperación' } })

  const firstRender = renderComponent()
  fillForm(firstRender, { email: 'usuario@test.com' })

  const secondRender = renderComponent()
  await clickForgotPassword(secondRender)

  const thirdRender = renderComponent()
  const errorAlert = getAlert(thirdRender, 'alert alert-error')

  expect(mockResetPasswordForEmail).toHaveBeenCalled()
  expect(errorAlert).toBeTruthy()
  expect(errorAlert.props.children).toBe('No se pudo enviar el correo de recuperación')
})
