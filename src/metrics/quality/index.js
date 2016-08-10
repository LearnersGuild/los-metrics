import {median, mean, stdDev} from '../../util/math'
import {table} from '../../util/presenters'
import {getRepositories, getRepositoryMetrics} from '../../fetchers/codeClimate'

function getRepositoriesMetrics() {
  return getRepositories()
    .then(repos => repos.map(repo => repo.id))
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
        minCoverage: Math.min(...coverages) / 100.0,
        maxCoverage: Math.max(...coverages) / 100.0,
        medianCoverage: median(coverages) / 100.0,
        meanCoverage: mean(coverages) / 100.0,
        stdDevCoverage: stdDev(coverages) / 100.0,
      }
    })
}

if (!module.parent) {
  getTopLevelMetrics()
    .then(metrics => console.info(table(metrics, {includeHeaders: true})))
    .catch(err => console.error(err.stack))
}
