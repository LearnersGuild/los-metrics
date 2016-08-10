function assertArray(values, func) {
  if (!Array.isArray(values)) {
    throw new Error(`can only compute the ${func} of an array`)
  }
}

export function median(values) {
  assertArray(values, 'median')

  values = values.sort((a, b) => a - b)
  const middle = Math.floor((values.length - 1) / 2)
  if (values.length % 2) {
    return values[middle]
  }

  return (values[middle] + values[middle + 1]) / 2.0
}

export function mean(values) {
  assertArray(values, 'mean')

  const sum = values.reduce((sum, value) => sum + value, 0)
  return sum / values.length
}

export function stdDev(values) {
  assertArray(values, 'standard deviation')

  const avg = mean(values)
  const squareDiffs = values.map(value => {
    const diff = value - avg
    return diff * diff
  })
  const avgSquareDiff = mean(squareDiffs)
  return Math.sqrt(avgSquareDiff)
}
