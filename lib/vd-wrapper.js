import h from 'virtual-dom/h.js'

// Simple function to convert vdom to HTML string
function toHTML(vdom) {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return String(vdom)
  }
  
  if (!vdom || !vdom.tagName) {
    return ''
  }
  
  let html = `<${vdom.tagName}`
  
  // Add attributes
  if (vdom.properties) {
    for (let [key, value] of Object.entries(vdom.properties)) {
      if (key === 'className') {
        html += ` class="${value}"`
      } else if (key === 'style' && typeof value === 'object') {
        const styleStr = Object.entries(value)
          .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
          .join(';')
        html += ` style="${styleStr}"`
      } else if (value !== null && value !== undefined && value !== false) {
        html += ` ${key}="${value}"`
      }
    }
  }
  
  html += '>'
  
  // Add children
  if (vdom.children && vdom.children.length > 0) {
    for (let child of vdom.children) {
      html += toHTML(child)
    }
  }
  
  html += `</${vdom.tagName}>`
  
  return html
}

// Simple wrapper to provide vd-like API using virtual-dom
function dom(tagOrSelector, ...args) {
  // Handle CSS selector format like '.class' or '#id'
  let tag = 'div'
  let props = {}
  let children = []
  
  if (typeof tagOrSelector === 'string') {
    if (tagOrSelector.startsWith('.')) {
      // Class selector
      tag = 'div'
      props.className = tagOrSelector.slice(1).replace(/\./g, ' ')
    } else if (tagOrSelector.startsWith('#')) {
      // ID selector
      tag = 'div'
      props.id = tagOrSelector.slice(1)
    } else {
      // Regular tag name
      tag = tagOrSelector
    }
  }
  
  // Process arguments
  for (let arg of args) {
    if (typeof arg === 'object' && arg !== null && !Array.isArray(arg) && !arg.tagName && typeof arg !== 'string') {
      // Properties object
      Object.assign(props, arg)
    } else if (Array.isArray(arg)) {
      // Array of children
      children.push(...arg)
    } else {
      // Individual child (string, number, or vdom element)
      children.push(arg)
    }
  }
  
  const vdom = h(tag, props, children.length > 0 ? children : undefined)
  
  // Add toHTML method to the vdom object
  vdom.toHTML = () => toHTML(vdom)
  
  return vdom
}

// Export a function that can be used as: dom('div', ...)
export default dom 