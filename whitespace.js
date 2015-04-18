'use strict';

var blocks = require('block-elements').map(function (name) {
  return name.toUpperCase()
})

function defaultBlockTest (node) {
  return isElem(node) && blocks.indexOf(node.nodeName) >= 0
}

function isText (node) {
  return node && node.nodeType === 3
}

function isElem (node) {
  return node && node.nodeType === 1
}

/**
 * whitespace(elem [, isBlock]) removes extraneous whitespace from an
 * the given element. The function isBlock may optionally be passed in
 * to determine whether or not an element is a block element; if none
 * is provided, defaults to using the list of block elements provided
 * by the `block-elements` module.
 *
 * @param {Element} root
 * @param {Function} isBlock
 */
function whitespace (root, isBlock) {
  var startSpace = /^ /,
      endSpace = / $/,
      nextNode,
      prevNode,
      prevText,
      node,
      text

  if (typeof isBlock !== 'function')
    isBlock = defaultBlockTest

  function next (node) {
    while (node && node !== root) {
      if (node.nextSibling)
        return node.nextSibling

      node = node.parentNode
      if (prevText && isBlock(node)) {
        prevText.data = prevText.data.replace(/[ \r\n\t]$/, '')
        prevText = null
      }
    }

    return null
  }

  function first (node) {
    return node.firstChild ? node.firstChild : next(node)
  }

  function remove (node) {
    var nextNode = next(node)

    node.parentNode.removeChild(node)
    return nextNode
  }

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
        text = text.replace(startSpace, '')
      if (nextNode && isBlock(nextNode))
        text = text.replace(endSpace, '')

      if (prevText && endSpace.test(prevText.data) &&
          startSpace.test(text))
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
        prevText.data = prevText.data.replace(endSpace, '')
        prevText = null
      }

      node = first(node)
    } else {
      node = remove(node)
    }
  }

  // Trim trailing space from last text node
  if (prevText)
    prevText.data = prevText.data.replace(endSpace, '')
}

module.exports = whitespace
