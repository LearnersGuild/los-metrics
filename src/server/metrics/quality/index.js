import config from 'config'
import logErrorAndExit from '../../util/logErrorAndExit'
import {weightedMean} from '../../util/math'
import {table} from '../../util/presenters'
import {
  getRepositoryInfo,
  getRepositoryTestReports,
} from '../../fetchers/codeClimate'
import {getRepo} from '../../fetchers/gitHub'
import {saveEvent} from '../../fetchers/keen'

/* eslint-disable camelcase */
async function getRepositoriesSizesAndMetrics() {
  const repos = config.get('quality.repos')
  const ghRepos = await Promise.all(repos.map(repo => getRepo(repo)))
  const reposInfos = await Promise.all(ghRepos.map(repo => getRepositoryInfo(repo.full_name)))
  const reposTestReports = await Promise.all(reposInfos.map(info => getRepositoryTestReports(info.data[0].id)))

  const names = repos.map(repo => repo.name)
  const sizes = ghRepos.map(repo => repo.size)
  const gpas = reposInfos.map(info => info.data[0].attributes.score)
  const coveredPercents = reposTestReports.map(repo => repo.data[0].attributes.covered_percent)

  const sizesAndMetrics = names.map((name, i) => ({
    name,
    // Because the size of the echo-chat repository is so HUGE, and because
    // most of it is not our code, we'll override its size with a hardcoded
    // estimate of 200k (from 2016-09-21, using `du -h` on the filesystem).
    // Ugly? Yes. Better than misleading metrics? HELL yes.
    size: name === 'echo-chat' ? 200 : sizes[i],
    gpa: gpas[i],
    coveredPercent: coveredPercents[i],
  }))

  return sizesAndMetrics
}

async function getTopLevelMetrics() {
  const metrics = await getRepositoriesSizesAndMetrics()
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
