function assertArray(values, func, arg = 'values') {
  if (!Array.isArray(values)) {
    throw new Error(`can only compute the ${func} when ${arg} argument is an array`)
  }
}

export function median(values) {
  assertArray(values, 'median')

  const sortedValues = values.slice(0).sort((a, b) => a - b)
  const middle = Math.floor((sortedValues.length - 1) / 2)
  if (sortedValues.length % 2) {
    return sortedValues[middle]
  }

  return (sortedValues[middle] + sortedValues[middle + 1]) / 2.0
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

export function weightedMean(values, weights) {
  assertArray(values, 'weightedMean', 'values')
  assertArray(weights, 'weightedMean', 'weights')

  const weighted = values.reduce((sum, value, i) => sum + (value * weights[i]), 0)
  return weighted
}
