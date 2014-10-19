'use strict';

// Things that are normally block elements.
var blocks = {
  ADDRESS: 1,
  ASIDE: 1,
  BLOCKQUOTE: 1,
  DIV: 1,
  FIGCAPTION: 1,
  FIGURE: 1,
  FOOTER: 1,
  H1: 1,
  H2: 1,
  H3: 1,
  H4: 1,
  H5: 1,
  H6: 1,
  HEADER: 1,
  LI: 1,
  OL: 1,
  P: 1,
  PRE: 1,
  UL: 1
}

function isBlock (node) {
  return !!(isElem(node) && blocks[node.nodeName])
}

function isText (node) {
  return node && node.nodeType === Node.TEXT_NODE
}

function isElem (node) {
  return node && node.nodeType === Node.ELEMENT_NODE
}

function nextSibling (root) {
  return function next (node) {
    while (node && node !== root) {
      if (node.nextSibling)
        return node.nextSibling

      node = node.parentNode
    }

    return null
  }
}

function firstChild (next) {
  return function first (node) {
    return node.firstChild ? node.firstChild : next(node)
  }
}

function removeChild (next) {
  return function remove (node) {
    var nextNode = next(node)

    node.parentNode.removeChild(node)
    return nextNode
  }
}

/**
 * whitespace(elem) removes extraneous whitespace from an element
 * and its children.
 *
 * @param {Element} root
 */
function whitespace (root) {
  var next = nextSibling(root),
      first = firstChild(next),
      remove = removeChild(next),
      nextNode,
      prevNode,
      prevText,
      node,
      text

  if (root.nodeName === 'PRE') return

  // Join adjacent text nodes and whatnot.
  root.normalize()

  node = first(root)
  while (node) {
    prevNode = node.previousSibling
    nextNode = node.nextSibling

    if (isText(node)) {
      text = node.data.replace(/[ \r\n\t]+/g, ' ')

      if (!prevText || prevNode && isBlock(prevNode))
        text = text.replace(/^[ \r\n\t]+/, '')
      if (nextNode && isBlock(nextNode))
        text = text.replace(/[ \r\n\t]+$/, '')

      if (prevText && /[ \r\n\t]$/.test(prevText.data) &&
          /^[ \r\n\t]/.test(text))
        text = text.substr(1)

      if (text) {
        node.data = text
        prevText = node
        node = next(node)
      } else {
        node = remove(node)
      }
    } else if (isElem(node)) {
      if (node.nodeName === 'PRE') {
        node = next(node)
        continue
      }

      if (prevText && isBlock(node)) {
        // FIXME: most of these Regexes should only be for spaces
        prevText.data = prevText.data.replace(/[ \r\n\t]$/, '')
        prevText = null
      }

      node = first(node)
    } else {
      node = remove(node)
    }
  }

  // Trim trailing space from last text node
  if (prevText)
    prevText.data = prevText.data.replace(/[ \r\n\t]+$/, '')
}

module.exports = whitespace
