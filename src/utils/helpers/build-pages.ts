export function buildPages(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }).map((_, index) => index + 1)
  }

  let leftStart = Math.max(1, currentPage - 1)
  if (leftStart + 2 > totalPages) {
    leftStart = Math.max(1, totalPages - 2)
  }
  const leftBlock = Array.from({ length: 3 }, (_, i) => leftStart + i).filter(
    (page) => page <= totalPages,
  )

  const rightStart = Math.max(totalPages - 2, 1)
  const rightBlock = Array.from(
    { length: Math.min(3, totalPages - rightStart + 1) },
    (_, i) => rightStart + i,
  )

  const pages: Array<number | 'ellipsis'> = []

  leftBlock.forEach((page) => {
    if (!pages.includes(page)) {
      pages.push(page)
    }
  })

  const lastPage = pages[pages.length - 1]

  const needsEllipsis =
    rightBlock.length &&
    pages.length &&
    typeof lastPage === 'number' &&
    rightBlock[0] - lastPage > 1

  if (needsEllipsis) {
    pages.push('ellipsis')
  }

  rightBlock.forEach((page) => {
    if (!pages.includes(page)) {
      pages.push(page)
    }
  })

  return pages
}