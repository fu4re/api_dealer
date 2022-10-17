const handleArrowKeys = (e, { allowVerticalArrows }) => {
  const { activeElement } = document

  const getNthChildSafe = (element, index) => (element?.children[index] ?? null)

  const getStandardItem = (item) => {
    return item && (item.hasAttribute('aria-hidden') ? null : item)
  }

  const { nextSibling: nextRow, previousSibling: previousRow } = activeElement.parentElement

  const next = activeElement.nextSibling || getNthChildSafe(nextRow, 0)
  const nextSibling = getStandardItem(next)

  const previousRowLength = previousRow ? previousRow.children.length - 1 : 0

  const prev = activeElement.previousSibling || getNthChildSafe(previousRow, previousRowLength)
  const previousSibling = getStandardItem(prev)

  const children = Array.from(activeElement.parentElement.children)
  const index = children.indexOf(activeElement)
  const getVerticalSibling = (row) => getNthChildSafe(row, index)

  const downSibling = getStandardItem(getVerticalSibling(nextRow))
  const upSibling = getStandardItem(getVerticalSibling(previousRow))
  const isDefaultSelectable = activeElement.dataset.isDefaultSelectable === 'true'

  if (!isDefaultSelectable) activeElement.tabIndex = '-1'

  const focusIfAvailable = (element) => {
    e.preventDefault()
    if (element) {
      element.setAttribute('tabindex', '0')
      element.focus()
    }
  }

  switch (e.key) {
    case 'ArrowRight':
      focusIfAvailable(nextSibling)
      break
    case 'ArrowLeft':
      focusIfAvailable(previousSibling)
      break
    case 'ArrowDown':
      if (allowVerticalArrows) focusIfAvailable(downSibling)
      break
    case 'ArrowUp':
      if (allowVerticalArrows) focusIfAvailable(upSibling)
      break
    default:
      break
  }
}

export default handleArrowKeys
