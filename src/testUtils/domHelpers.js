exports.flattenChildren = (children) => {
  if (children === null || children === undefined) return []
  return Array.isArray(children) ? children : [children]
}

exports.findElement = (node, predicate) => {
  if (!node || typeof node !== 'object') return null
  if (predicate(node)) return node
  const children = node.props?.children
  for (const child of exports.flattenChildren(children)) {
    const found = exports.findElement(child, predicate)
    if (found) return found
  }
  return null
}
