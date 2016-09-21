import {weightedMean} from '../../util/math'
import {table} from '../../util/presenters'
import {getRepositories, getRepositoryMetrics} from '../../fetchers/codeClimate'
import {getRepo} from '../../fetchers/gitHub'

function getRepositoriesSizesAndMetrics() {
  return getRepositories()
    .then(repos => repos.map(repo => ({
      id: repo.id,
      name: repo.url.match(/[:/][A-Za-z_-]+\/([A-Za-z_-]+)\.git$/)[1]
    })))
    .then(repos => {
      return Promise.all(repos.map(repo => getRepo(repo.name)))
        .then(sizes => {
          return Promise.all(repos.map(repo => getRepositoryMetrics(repo.id)))
            .then(metrics => ({sizes, metrics}))
        })
    })
    .then(({sizes, metrics}) => (
      /* eslint-disable camelcase */
      metrics.map(({
        name,
        last_snapshot: {
          gpa,
          covered_percent: coveredPercent,
        },
        previous_snapshot: {
          covered_percent: previousCoveredPercent,
        },
      }, i) => ({
        name,
        size: sizes[i].size,
        gpa,
        // For some reason, CodeClimate's API sometimes returns null in
        // last_snapshot.covered_percent. :-(
        coveredPercent: coveredPercent || previousCoveredPercent,
      }))
    ))
}

function getTopLevelMetrics() {
  return getRepositoriesSizesAndMetrics()
    .then(metrics => {
      // Because the size of the echo-chat repository is so HUGE, and because
      // most of it is not our code, we'll override its size with a hardcoded
      // estimate of 200k (from 2016-09-21, using `du -h` on the filesystem).
      // Ugly? Yes. Better than misleading metrics? HELL yes.
      const echoChatIdx = metrics.findIndex(m => m.name === 'echo-chat')
      if (echoChatIdx >= 0) {
        metrics[echoChatIdx].size = 200
      }
      const totalSize = metrics.map(m => m.size).reduce((total, curr) => total + curr, 0)
      const weights = metrics.map(m => m.size / totalSize)
      const gpas = metrics.map(m => m.gpa)
      const coverages = metrics.map(m => m.coveredPercent)
      return {
        minGPA: Math.min(...gpas),
        maxGPA: Math.max(...gpas),
        weightedMeanGPA: weightedMean(gpas, weights),
        minCoverage: Math.min(...coverages) / 100.0,
        maxCoverage: Math.max(...coverages) / 100.0,
        weightedMeanCoverage: weightedMean(coverages, weights) / 100.0,
      }
    })
}

if (!module.parent) {
  getTopLevelMetrics()
    .then(metrics => console.info(table(metrics, {includeHeaders: true})))
    .catch(err => console.error(err.stack))
}
