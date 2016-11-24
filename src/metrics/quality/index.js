import logErrorAndExit from '../../util/logErrorAndExit'
import {weightedMean} from '../../util/math'
import {table} from '../../util/presenters'
import {getRepositories, getRepositoryMetrics} from '../../fetchers/codeClimate'
import {getRepo} from '../../fetchers/gitHub'
import {saveEvent} from '../../fetchers/keen'

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
      metrics.map((metric, i) => {
        const defaultSnapshot = {
          gpa: 0,
          covered_percent: 0,
        }
        const lastSnapshot = metric.last_snapshot || defaultSnapshot
        const previousSnapshot = metric.previous_snapshot || defaultSnapshot

        return {
          name: metric.name,
          size: sizes[i].size,
          gpa: lastSnapshot.gpa,
          // For some reason, CodeClimate's API sometimes returns null in
          // last_snapshot.covered_percent.
          coveredPercent: lastSnapshot.covered_percent || previousSnapshot.covered_percent,
        }
      }))
    )
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
        minCoverage: Math.min(...coverages),
        maxCoverage: Math.max(...coverages),
        weightedMeanCoverage: weightedMean(coverages, weights),
        _tsMillis: (new Date()).getTime(),
      }
    })
}

function saveQualityMetrics(qualityMetrics) {
  return saveEvent('quality', 'repoRollups', qualityMetrics)
}

async function run() {
  try {
    // save and display quality metrics
    const qualityMetrics = await getTopLevelMetrics()
    await saveQualityMetrics(qualityMetrics)
    console.info(table(qualityMetrics, {includeHeaders: true}))
  } catch (err) {
    logErrorAndExit(err)
  }
}

if (!module.parent) {
  /* eslint-disable xo/no-process-exit */
  run().then(() => process.exit(0))
}
