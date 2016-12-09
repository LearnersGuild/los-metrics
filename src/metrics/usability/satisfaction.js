import config from 'config'
import {MongoClient as mongo} from 'mongodb'

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
  const mongoURL = config.get('usability.mongoURL')
  const channelName = 'support'
  const fromDate = new Date()
  fromDate.setUTCDate(fromDate.getUTCDate() - 1)

  const db = await mongo.connect(mongoURL)
  const [{_id: rid}] = await db.collection('rocketchat_room')
    .find({name: channelName}, {_id: true})
    .toArray()
  const count = await db.collection('rocketchat_message')
    .find({
      rid,
      ts: {
        $gte: fromDate,
      }
    })
    .count()

  const supportMessageCount = {
    channelName,
    count,
  }
  await saveEvent('usability', 'supportMessageCounts', supportMessageCount)
}
