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
  if (button && typeof button.props.onClick === 'function') {
    await button.props.onClick()
  }
}

module.exports = {
  flattenChildren,
  findElement,
  findAllElements,
  getInput,
  getForm,
  getButton,
  getForgotPasswordButton,
  getErrorText,
  getAlert,
  getAllErrorMessages,
  fillForm,
  submitForm,
  clickForgotPassword,
}

