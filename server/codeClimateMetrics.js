import {getRepositoryIds, getRepositoryMetrics} from '../common/fetchers/codeClimate'

function getRepositoriesMetrics() {
  return getRepositoryIds()
    .then(repoIds => Promise.all(repoIds.map(repoId => getRepositoryMetrics(repoId))))
    .then(metrics => (
      /* eslint-disable camelcase */
      metrics.map(({
        name,
        last_snapshot: {
          gpa,
          covered_percent: coveredPercent,
        },
      }) => ({
        name,
        gpa,
        coveredPercent
      }))
    ))
}

function median(values) {
  values = values.sort((a, b) => a - b)

  const middle = Math.floor((values.length / 2) - 1)
  if (values.length % 2) {
    return values[middle]
  }

  return (values[middle] + values[middle + 1]) / 2.0
}

function mean(values) {
  const sum = values.reduce((sum, value) => sum + value, 0)
  return sum / values.length
}

function stdDev(values) {
  const avg = mean(values)
  const squareDiffs = values.map(value => {
    const diff = value - avg
    return diff * diff
  })
  const avgSquareDiff = mean(squareDiffs)
  return Math.sqrt(avgSquareDiff)
}

function getTopLevelMetrics() {
  return getRepositoriesMetrics()
    .then(metrics => {
      const gpas = metrics.map(m => m.gpa)
      const coverages = metrics.map(m => m.coveredPercent)
      return {
        minGPA: Math.min(...gpas),
        maxGPA: Math.max(...gpas),
        medianGPA: median(gpas),
        meanGPA: mean(gpas),
        stdDevGPA: stdDev(gpas),
        minCoverage: Math.min(...coverages),
        maxCoverage: Math.max(...coverages),
        medianCoverage: median(coverages),
        meanCoverage: mean(coverages),
        stdDevCoverage: stdDev(coverages),
      }
    })
}

if (!module.parent) {
  require('dotenv').load()

  getTopLevelMetrics()
    .then(metrics => {
      const keys = Object.keys(metrics)
      const values = Object.keys(metrics).map(key => metrics[key])
      console.log(keys.join('\t'))
      console.log(values.join('\t'))
    })
    .catch(err => console.error(err.stack))
}
