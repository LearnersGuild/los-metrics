import config from 'config'

import {getIssuesForRepo} from '../../fetchers/gitHub'
import {saveEvent} from '../../fetchers/keen'

export async function saveIssueMetrics() {
  const repoName = config.get('usability.repo')
  const issues = await getIssuesForRepo(repoName, {state: 'all'})
  const countsByLabel = issues
    .filter(issue => issue.labels.length > 0)
    .reduce((result, issue) => {
      issue.labels.forEach(({name: label}) => {
        if (!result[label]) {
          result[label] = 0
        }
        result[label] += 1
      })
      return result
    }, {})

  const writeKeenEvents = Object.keys(countsByLabel).map(label => {
    const issueCount = {
      label,
      repoName,
      count: countsByLabel[label],
    }
    return saveEvent('usability', 'losIssueCountsByLabel', issueCount)
  })

  await Promise.all(writeKeenEvents)
}

export async function saveSupportMetrics() {
  await Promise.resolve()
}
